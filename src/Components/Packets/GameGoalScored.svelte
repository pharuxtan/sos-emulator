<script lang="ts">

  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import ObservableSlim from "observable-slim";
  import Select from 'svelte-select';
  import type SOS from "../../lib/SOS";
  import type { game_goal_scored } from "../../lib/packets/GameGoalScored";

  export let sos: SOS;
  let game_goal_scored = sos.packets.game_goal_scored;

  let packet: game_goal_scored = ObservableSlim.create(game_goal_scored.packet, true, onChange);

  let code = HighlightPacketJSON(packet);

  function onChange(){
    code = HighlightPacketJSON(packet);
    localStorage.setItem("game:goal_scored", JSON.stringify(packet));
  }

  let static_values = {
    speed: packet.data.goalspeed,
    time: packet.data.goaltime,
    x: packet.data.impact_location.X,
    y: packet.data.impact_location.Y,
    last_speed: packet.data.ball_last_touch.speed
  }

  // Goal Speed & Time

  function inputSpeed(){
    if(this.value ==  "") return packet.data.goalspeed = 0;
    packet.data.goalspeed = parseFloat(this.value);
  }

  function inputTime(){
    if(this.value ==  "") return packet.data.goaltime = 0;
    packet.data.goaltime = parseInt(this.value);
  }

  // Impact location

  function inputLocation(){
    if(this.value ==  "" || this.value == "-") return packet.data.impact_location[this.id] = 0;
    packet.data.impact_location[this.id] = parseFloat(this.value);
  }

  // Scorer, Assister, Ball Last Touch Player

  let nonePlayer = { value: sos.nonePlayer, label: "none" };
  let scorers = [];
  let assisters = [];
  let last_touch_players = [];

  for(let p of sos.players){
    scorers.push({ value: p, label: p.player.id});
  }

  let scorer = game_goal_scored.scorer.isNone ? nonePlayer : scorers.find(p => p.value == game_goal_scored.scorer);
  let assister = nonePlayer;
  let last_touch_player = nonePlayer;

  function updatePlayers(firstUpdate = false){
    if(scorer.value.isNone){
      assisters = [];
      last_touch_players = [];
      selectAssister({ detail: nonePlayer, isFromUpdater: true });
      selectLastTouchPlayer({ detail: nonePlayer, isFromUpdater: true });
    } else {
      let scorer_team = scorer.value.player.team;

      // Assisters
      assisters.splice(0, assisters.length);
      assisters.push(nonePlayer);
      for(let player of sos.players.filter(p => p.player.team == scorer_team)){
        if(player == scorer.value) continue;
        assisters.push({ value: player, label: player.player.id});
      }
      assisters = assisters;

      //Ball Last Touch Player
      last_touch_players.splice(0, last_touch_players.length);
      last_touch_players.push(scorer);
      for(let player of sos.players.filter(p => p.player.team != scorer_team)){
        last_touch_players.push({ value: player, label: player.player.id});
      }
      last_touch_players = last_touch_players;

      // Checks

      if(firstUpdate){
        assister = assisters.find(p => p.value == game_goal_scored.assister);
        if(game_goal_scored.last_touch_player.isNone) selectLastTouchPlayer({ detail: scorer, isFromUpdater: true });
        else last_touch_player = last_touch_players.find(p => p.value == game_goal_scored.last_touch_player);
      }

      if((!assister.value.isNone && assister.value.player.team != scorer_team) || (assister.value == scorer.value)){
        selectAssister({ detail: nonePlayer, isFromUpdater: true });
      }

      if(last_touch_player.value.isNone || (last_touch_player.value != scorer && last_touch_player.value.player.team == scorer_team)){
        selectLastTouchPlayer({ detail: scorer, isFromUpdater: true });
      }
    }
  }
  
  updatePlayers(true);

  function selectScorer(event){
    scorer = event.detail;
    game_goal_scored.setScorer(event.detail.value, packet);
    updatePlayers();
  }

  function selectAssister(event){
    assister = event.detail;
    game_goal_scored.setAssister(event.detail.value, packet);
    if(!event.isFromUpdater) updatePlayers();
  }

  function selectLastTouchPlayer(event){
    last_touch_player = event.detail;
    game_goal_scored.setBallLastTouch(event.detail.value, packet);
    if(!event.isFromUpdater) updatePlayers();
  }

  // Ball Last Touch Speed

  function inputLastSpeed(){
    if(this.value ==  "") return packet.data.ball_last_touch.speed = 0;
    packet.data.ball_last_touch.speed = parseFloat(this.value);
  }

  // Send Packet

  function sendPacket(){
    if(!scorer.value.isNone) return game_goal_scored.sendPacket();
    sos.popup.showPopup(
      "No player is scoring the ball?",
      "Unfortunately SOS don't send goal scored with no player, so you need to set a scorer",
      [{
        name: "Ok"
      }]
    );
  }

  // Reset Packet

  function resetPacket(){
    game_goal_scored.newPacket();
    packet = ObservableSlim.create(game_goal_scored.packet, true, onChange);
    selectScorer({ detail: nonePlayer });
    static_values = {
      speed: packet.data.goalspeed,
      time: packet.data.goaltime,
      x: packet.data.impact_location.X,
      y: packet.data.impact_location.Y,
      last_speed: packet.data.ball_last_touch.speed
    }
    onChange();
  }
</script>

<game:goal_scored>
  <p class=title>game:goal_scored</p>
  <p class=description>This packet is sent when a goal is scored</p>
  <div class=separator></div>
  <p class=values>Goal Speed: <input type=text bind:value={static_values.speed} on:beforeinput={sos.filter.float} on:input={inputSpeed} /></p>
  <p class=values>Goal Time: <input type=text bind:value={static_values.time} on:beforeinput={sos.filter.number} on:input={inputTime} /></p>
  <div class=impact>
    <p class=key>Impact location:</p>
    <p class=axis>X: <input type=text id=X bind:value={static_values.x} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} /></p>
    <p class=axis>Y: <input type=text id=Y bind:value={static_values.y} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} /></p>
  </div>
  <div class=player>
    <p>Scorer: </p>
    {#key scorers} {#key scorer}
      <Select items={scorers} value={scorer} noOptionsMessage="There is no player in game:update_state" on:select={selectScorer} />
    {/key} {/key}
  </div>
  <div class=player>
    <p>Assister: </p>
    {#key assisters} {#key assister}
      <Select items={assisters} value={assister} on:select={selectAssister} noOptionsMessage="Select a scorer first" />
    {/key} {/key}
  </div>
  <div class=last_touch>
    <p class=subtitle>Ball last touch</p>
    <div class=player>
      <p>Player:</p>
      {#key last_touch_players} {#key last_touch_player}
        <Select items={last_touch_players} value={last_touch_player} on:select={selectLastTouchPlayer} noOptionsMessage="Select a scorer first" />
      {/key} {/key}
    </div>
    <p class=values>Speed: <input type=text bind:value={static_values.last_speed} on:beforeinput={sos.filter.float} on:input={inputLastSpeed} /></p>
  </div>
  <input type=button on:click={sendPacket} value="Send the packet" />
  <input type=button on:click={resetPacket} value="Reset the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:goal_scored>

<style lang="scss">
  input[type=text] {
    display: inline;

    padding: 5px 15px;
    border-radius: 10px;

    background-color: #e1e1e1;

    font-weight: normal;
    font-size: 0.8em;
  }

  .values input {
    width: 100px;
    margin: 0 5px;
    margin-bottom: 8px;
  }

  .impact {
    display: flex;
    flex-direction: row;

    margin-bottom: 8px;

    .key {
      margin-right: 8px;
    }

    .axis {
      font-size: 0.9em;
      font-weight: 500;
    }

    input {
      width: 100px;
      margin-right: 5px;
    }
  }

  .last_touch {
    .subtitle {
      width: 100%;
      margin: 10px 0;

      text-align: center;
      font-weight: 500;
      font-size: 1.2em;
    }
  }

  .player {
    --border: 2px solid #ddd;
    --borderRadius: 10px;
    --indicatorColor: #000;
    --height: 36px;

    display: flex;
    flex-direction: row;
    align-items: center;

    margin-bottom: 10px;

    p {
      margin-right: 5px;
    }

    :global(.selectContainer) {
      display: inline-flex !important;
      width: 630px;
    }

    :global(.listContainer), :global(input) {
      width: 630px;
    }

    :global(.selectedItem), :global(.selection) {
      background: transparent;
      text-overflow: unset;
      overflow-x: unset;
    }

    :global(.item) {
      text-overflow: unset;
      overflow-x: hidden;
    }

    :global(.clearSelect) {
      display: none;
    }
  }
</style>