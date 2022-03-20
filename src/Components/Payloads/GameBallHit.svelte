<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import ObservableSlim from "observable-slim";
  import Select from 'svelte-select';
  import type SOS from "../../lib/SOS";
  import type { game_ball_hit } from "../../lib/payloads/GameBallHit";

  export let sos: SOS;
  let game_ball_hit = sos.payloads.game_ball_hit;

  let payload: game_ball_hit = ObservableSlim.create(game_ball_hit.payload, true, onChange);

  let code = HighlightPayloadJSON(payload);

  function onChange(){
    code = HighlightPayloadJSON(payload);
    localStorage.setItem("game:ball_hit", JSON.stringify(payload));
  }

  // Players

  let nonePlayer = { value: sos.nonePlayer, label: "none" };
  let players = [];

  for(let p of sos.players){
    players.push({ value: p, label: p.player.id});
  }

  let player = game_ball_hit.player.isNone ? nonePlayer : players.find(p => p.value == game_ball_hit.player);

  function selectPlayer(event){
    player = event.detail;
    game_ball_hit.setPlayer(event.detail.value, payload);
  }

  // Ball

  let ball = {
    x: payload.data.ball.location.X,
    y :payload.data.ball.location.Y,
    z: payload.data.ball.location.Z,
    pre_speed: payload.data.ball.pre_hit_speed,
    post_speed: payload.data.ball.post_hit_speed
  };

  function inputLocation(){
    if(this.value ==  "" || this.value == "-") return payload.data.ball.location[this.id] = 0;
    payload.data.ball.location[this.id] = parseFloat(this.value);
  }

  function inputPreSpeed(){
    let speed = parseFloat(this.value == "" ? 0 : this.value);
    payload.data.ball.pre_hit_speed = speed;
  }

  function inputPostSpeed(){
    let speed = parseFloat(this.value == "" ? 0 : this.value);
    payload.data.ball.post_hit_speed = speed;
  }

  // Send Payload & Add to Queue

  function check(cb){
    if(!player.value.isNone) return cb();
    sos.popup.showPopup(
      "No player is touching the ball?",
      "You need to select a player before sending this payload",
      [{
        name: "Ok"
      }]
    );
  }

  // Reset Payload

  function resetPayload(){
    game_ball_hit.newPayload();
    payload = ObservableSlim.create(game_ball_hit.payload, true, onChange);
    player = game_ball_hit.player.isNone ? nonePlayer : players.find(p => p.value == game_ball_hit.player);
    ball = {
      x: payload.data.ball.location.X,
      y :payload.data.ball.location.Y,
      z: payload.data.ball.location.Z,
      pre_speed: payload.data.ball.pre_hit_speed,
      post_speed: payload.data.ball.post_hit_speed
    }
    onChange();
  }
</script>

<game:ball_hit>
  <p class=title>game:ball_hit</p>
  <p class=description>This payload is sent when a player touch the ball.</p>
  <div class=separator></div>
  <div class=player>
    <p>Player:</p>
    <Select items={players} value={player} noOptionsMessage="There is no player in game:update_state" on:select={selectPlayer} />
  </div> 
  <div class=ball>
    <p class=category>Ball</p>
    <div class=location>
      <p>X:</p>
      <input id=X type=text bind:value={ball.x} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} />
      <p>Y:</p>
      <input id=Y type=text bind:value={ball.y} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} />
      <p>Z:</p>
      <input id=Z type=text bind:value={ball.z} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} />
    </div>
    <p class=speed>Pre Hit Speed: <input type=text bind:value={ball.pre_speed} on:beforeinput={sos.filter.float} on:input={inputPreSpeed} /></p>
    <p class=speed>Post Hit Speed: <input type=text bind:value={ball.post_speed} on:beforeinput={sos.filter.float} on:input={inputPostSpeed} /></p>
  </div>
  <input type=button on:click={() => check(() => game_ball_hit.sendPayload())} value="Send the payload" />
  <input type=button on:click={resetPayload} value="Reset the payload" />
  <input type=button on:click={() => check(() => sos.payloads.addToQueue(game_ball_hit.clonePayload()))} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:ball_hit>

<style lang="scss">
  input[type=text] {
    display: inline;

    padding: 5px 15px;
    border-radius: 10px;

    background-color: #e1e1e1;

    font-weight: normal;
    font-size: 0.8em;
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

  .ball {
      margin-bottom: 5px;

      .category {
        margin: 5px 0;

        font-weight: 500;
        font-size: 1.2em;
      }

      .location {
        display: flex;
        flex-direction: row;
        align-items: center;

        margin-bottom: 6px;

        p {
          display: inline;
        }

        input {
          width: 50px;
          margin: 0 5px;
        }
      }

      .speed input {
        width: 100px;
        margin-bottom: 6px;
      }
    }
</style>