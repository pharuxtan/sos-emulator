<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import { Player as BPlayer } from "../../lib/types/Player";
  import { Arena } from "../../lib/types/Arena";
  import ObservableSlim from "observable-slim";
  import Select from 'svelte-select';
  import { ColorPicker, Color } from 'svelte-colorpick';
  import Switch from "svelte-switch";
  import Player from "../Player.svelte";
  import type SOS from "../../lib/SOS";
  import type { game_update_state } from "../../lib/packets/GameUpdateState";

  export let sos: SOS;
  let game_update_state = sos.packets.game_update_state;

  let packet: game_update_state = ObservableSlim.create(game_update_state.packet, true, onChange);

  let code = HighlightPacketJSON(packet);

  function onChange(){
    code = HighlightPacketJSON(packet);
    localStorage.setItem("game:update_state", JSON.stringify(packet));
  }

  /* Game */

  // Arena

  let arenas = [];

  for(let key of Object.keys(Arena)){
    arenas.push({
      value: key,
      label: `${Arena[key]} [${key}]`,
      group: Arena[key].split(" (")[0]
    });
  }

  const groupBy = (item) => item.group;

  let arena = arenas.find(a => a.value == packet.data.game.arena);

  function selectArena(event) {
    packet.data.game.arena = event.detail.value;
  }

  // Time

  let time = packet.data.game.time_milliseconds;

  function inputTime(){
    let time = parseFloat(this.value == "" ? 0 : this.value);
    packet.data.game.time_milliseconds = time;
    packet.data.game.time_seconds = Math.ceil(time);
  }

  // Winner

  let winner = packet.data.game.winner.trim();

  function inputWinner(){
    if(this.value == "") packet.data.game.winner = "";
    else packet.data.game.winner = this.value.padEnd(8);
  }

  // Target

  let noneTarget = { value: sos.nonePlayer, label: "none" };
  let targets = [];

  targets.push(noneTarget);
  for(let p of sos.players){
    targets.push({ value: p, label: p.player.id});
  }

  let target = noneTarget;

  if(packet.data.game.hasTarget){
    let p = sos.players.find(p => p.player.id == packet.data.game.target);
    if(p) target = targets.find(a => a.value == p);
  }

  sos.onPlayersChange((players) => {
    targets.splice(0, targets.length);
    targets.push(noneTarget);
    for(let p of players){
      targets.push({ value: p, label: p.player.id});
    }
    if(target){
      if(players.indexOf(target.value) == -1){
        selectTarget({ detail: noneTarget });
      } else if(target.label != target.value.player.id){
        target.label = target.value.player.id;
        selectTarget({ detail: target });
      }
    }
    targets = targets;
  });

  function selectTarget(event){
    target = event.detail;
    if(event.detail.label == "none"){
      packet.data.game.target = "";
    } else {
      packet.data.game.target = event.detail.label;
    }
    packet.data.game.hasTarget = event.detail.label != "none";
  }

  // Teams

  let blue = ObservableSlim.create({
    color_primary: Color.hex("#"+packet.data.game.teams[0].color_primary),
    color_secondary: Color.hex("#"+packet.data.game.teams[0].color_secondary)
  }, true, (e) => {
    let data = e.slice(-1)[0];
    packet.data.game.teams[0][data.property] = data.newValue.toHex().replace("#", "").toUpperCase();
  });

  let blue_score = packet.data.game.teams[0].score;
  function inputBlueScore(){
    let score = parseInt(this.value == "" ? 0 : this.value);
    packet.data.game.teams[0].score = score;
  }

  let orange = ObservableSlim.create({
    color_primary: Color.hex("#"+packet.data.game.teams[1].color_primary),
    color_secondary: Color.hex("#"+packet.data.game.teams[1].color_secondary)
  }, true, (e) => {
    let data = e.slice(-1)[0];
    packet.data.game.teams[1][data.property] = data.newValue.toHex().replace("#", "").toUpperCase();
  });

  let orange_score = packet.data.game.teams[1].score;
  function inputOrangeScore(){
    let score = parseInt(this.value == "" ? 0 : this.value);
    packet.data.game.teams[1].score = score;
  }

  // Ball

  let ball = {
    x: packet.data.game.ball.location.X,
    y :packet.data.game.ball.location.Y,
    z: packet.data.game.ball.location.Z,
    speed: packet.data.game.ball.speed
  };

  function inputLocation(){
    if(this.value ==  "" || this.value == "-") return packet.data.game.ball.location[this.id] = 0;
    packet.data.game.ball.location[this.id] = parseFloat(this.value);
  }

  function inputSpeed(){
    let speed = parseFloat(this.value == "" ? 0 : this.value);
    packet.data.game.ball.speed = speed;
  }

  let teams = [
    {value: 0, label: 'BLUE'},
    {value: 1, label: 'ORANGE'}
  ];

  let ballTeamValue = teams[packet.data.game.ball.team];

  function selectTeam(event) {
    packet.data.game.ball.team = event.detail.value;
  }

  // Players

  let playerName = "";

  for(let player of sos.players){
    player.setState = (old_id, new_id) => {
      if(old_id == false){
        let index = sos.players.indexOf(player);
        delete packet.data.players[player.player.id];
        sos.players = sos.players.filter(p => p.uniqueId != player.uniqueId);
        for(let i=index; i<sos.players.length; i++){
          sos.players[i].setId(i+1);
        }
        players = sos.players;
      } else
        delete Object.assign(packet.data.players, {[new_id]: packet.data.players[old_id]})[old_id];
    }
  }

  let players = [...sos.players];

  function addPlayer(){
    if(playerName == ""){
      return sos.popup.showPopup(
        "You trying to give an empty name to a player?",
        "Player can't have an empty name, please enter one.",
        [{
          name: "Ok"
        }]
      )
    }
    let player = new BPlayer(sos.players.length+1, playerName, sos.players.length);
    player.setState = (old_id, new_id) => {
      if(old_id == false){
        let index = sos.players.indexOf(player);
        delete packet.data.players[player.player.id];
        sos.players = sos.players.filter(p => p.uniqueId != player.uniqueId);
        for(let i=index; i<sos.players.length; i++){
          if(sos.players[i]) sos.players[i].setId(i+1);
        }
        players = sos.players;
      } else
        delete Object.assign(packet.data.players, {[new_id]: packet.data.players[old_id]})[old_id];
    }
    sos.players.push(player);
    players = [...sos.players];
    packet.data.players[player.player.id] = player.player;
  }

  /* Reset Packet */

  function resetPacket(){
    game_update_state.newPacket();
    packet = ObservableSlim.create(game_update_state.packet, true, onChange);
    arena = arenas.find(a => a.value == packet.data.game.arena);
    time = packet.data.game.time_milliseconds;
    winner = packet.data.game.winner.trim();
    blue.color_primary = Color.hex("#"+packet.data.game.teams[0].color_primary);
    blue.color_secondary = Color.hex("#"+packet.data.game.teams[0].color_secondary);
    blue_score = packet.data.game.teams[0].score;
    orange.color_primary = Color.hex("#"+packet.data.game.teams[1].color_primary);
    orange.color_secondary = Color.hex("#"+packet.data.game.teams[1].color_secondary);
    orange_score = packet.data.game.teams[1].score;
    ballTeamValue = teams[packet.data.game.ball.team];
    ball = {
      x: packet.data.game.ball.location.X,
      y :packet.data.game.ball.location.Y,
      z: packet.data.game.ball.location.Z,
      speed: packet.data.game.ball.speed
    };
    onChange();
  }
</script>

<!-- Call sos players change functions -->
{#key players}
  <script>
    for(let func of sos.plChFuncs){
      func(sos.players);
    }
  </script>
{/key}

<game:update_state>
  <p class=title>game:update_state</p>
  <p class=description>This packet is sended when you are in a match on an interval you've setuped in sos plugin settings</p>
  <div class=separator></div>
  <div class=game>
    <p class=subtitle>Game:</p>
    <div class=arena>
      <p>Arena:</p>
      <Select items={arenas} value={arena} {groupBy} on:select={selectArena}/>
    </div>
    <p class=time>Time (in seconds): <input type=text bind:value={time} on:beforeinput={sos.filter.float} on:input={inputTime} /></p>
    <div class=switch>
      <p>Overtime:</p>
      <Switch bind:checked={packet.data.game.isOT} handleDiameter={0} width={42} height={20}/>
    </div>
    <div class=switch>
      <p>Replay:</p>
      <Switch bind:checked={packet.data.game.isReplay} handleDiameter={0} width={42} height={20}/>
    </div>
    <div class=switch>
      <p>Has a winner:</p>
      <Switch bind:checked={packet.data.game.hasWinner} handleDiameter={0} width={42} height={20}/>
    </div>
    <p class=winner>Winner <span>(Has the team winner name when a club/RP match is finished)</span>: <input type=text bind:value={winner} on:input={inputWinner} /></p>
    <div class=target>
      <p>Spectator target:</p>
      {#key targets} {#key target}
        <Select items={targets} value={target} noOptionsMessage="There is no player" on:select={selectTarget} />
      {/key} {/key}
    </div>
    <div class=teams>
      <div class=blue>
        <p class=team>Blue</p>
        <p class=name>Name: <input type=text bind:value={packet.data.game.teams[0].name} /></p>
        <p class=score>Score: <input type=number bind:value={blue_score} min=0 on:beforeinput={sos.filter.number} on:input={inputBlueScore} /></p>
        <div class=color>
          <p>Primary color:</p>
          <ColorPicker bind:color={blue.color_primary} showSliders={{"hsl.h": true}} collapse={true} matrixWidth={200} matrixHeight={200} scrollbarHeight={25} selectDimensions={false} showNumeric={false} showLabels={false} handleWidth={20} handleHeight={20} />
        </div>
        <div class=color>
          <p>Secondary color:</p>
          <ColorPicker bind:color={blue.color_secondary} showSliders={{"hsl.h": true}} collapse={true} matrixWidth={200} matrixHeight={200} scrollbarHeight={25} selectDimensions={false} showNumeric={false} showLabels={false} handleWidth={20} handleHeight={20} />
        </div>
      </div>
      <div class=orange>
        <p class=team>Orange</p>
        <p class=name>Name: <input type=text bind:value={packet.data.game.teams[1].name} /></p>
        <p class=score>Score: <input type=number bind:value={orange_score} min=0 on:beforeinput={sos.filter.number} on:input={inputOrangeScore} /></p>
        <div class=color>
          <p>Primary color:</p>
          <ColorPicker bind:color={orange.color_primary} showSliders={{"hsl.h": true}} collapse={true} matrixWidth={200} matrixHeight={200} scrollbarHeight={25} selectDimensions={false} showNumeric={false} showLabels={false} handleWidth={20} handleHeight={20} />
        </div>
        <div class=color>
          <p>Secondary color:</p>
          <ColorPicker bind:color={orange.color_secondary} showSliders={{"hsl.h": true}} collapse={true} matrixWidth={200} matrixHeight={200} scrollbarHeight={25} selectDimensions={false} showNumeric={false} showLabels={false} handleWidth={20} handleHeight={20} />
        </div>
      </div>
    </div>
    <div class=ball>
      <p class=category>Ball</p>
      <div class=team>
        <p>Last team touch: </p>
        <Select items={teams} value={ballTeamValue} on:select={selectTeam} isSearchable={false} />
      </div>
      <div class=location>
        <p>X:</p>
        <input id=X type=text bind:value={ball.x} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} />
        <p>Y:</p>
        <input id=Y type=text bind:value={ball.y} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} />
        <p>Z:</p>
        <input id=Z type=text bind:value={ball.z} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} />
      </div>
      <p class=speed>Speed: <input type=text bind:value={ball.speed} on:beforeinput={sos.filter.float} on:input={inputSpeed} /></p>
    </div>
  </div>
  <div class=play>
    <p class=subtitle>Players:</p>
    <div class=players>
      {#each players as player (player.uniqueId)}
        {#if !player.deleted}
          <Player {sos} {player} {onChange} />
        {/if}
      {/each}
    </div>
    <div class=add>
      <p class=tip>Tip: You can hold shift and click to quick delete a player</p>
      <p class=speed>Name:</p>
      <input type=text bind:value={playerName} on:keyup={(e) => {if(e.key == "Enter") addPlayer()}} />
      <input type=button on:click={addPlayer} value="Add a new player" />
    </div>
  </div>
  <input type=button on:click={game_update_state.sendPacket} value="Send the packet" />
  <input type=button on:click={resetPacket} value="Reset the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:update_state>

<style lang="scss">
  .subtitle {
		margin: 10px 0;

		font-weight: 600;
		font-size: 1.5em;
  }

  input[type=text], input[type=number] {
    display: inline;

    padding: 5px 15px;
    border-radius: 10px;

    background-color: #e1e1e1;

    font-weight: normal;
    font-size: 0.8em;
  }

  .game {
    position: relative;

    width: 100%;

    .arena {
      display: flex;
      flex-direction: row;
      align-items: center;

      margin-bottom: 10px;

      p {
        margin-right: 5px;
      }

      --border: 2px solid #ddd;
      --borderRadius: 10px;
      --indicatorColor: #000;
      --height: 36px;

      :global(.selectContainer) {
        display: flex;
        width: 500px;
      }

      :global(.listContainer), :global(input) {
        width: 105px;
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

    .time input {
      width: 100px;
      margin-bottom: 10px;
    }

    .winner {
      span {
        font-size: 0.8em;
      }

      input {
        width: 200px;
        margin-bottom: 10px;
      }
    }

    .target {
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
        width: 550px;
      }

      :global(.listContainer), :global(input) {
        width: 550px;
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

    .teams {
      display: flex;
      flex-direction: row;
      align-items: stretch;

      margin-bottom: 5px;

      .blue {
        flex-grow: 1;
      }

      .orange {
        flex-grow: 1;
      }

      .team {
        margin: 5px 0;

        font-weight: 500;
        font-size: 1.2em;
      }

      .color {
        display: flex;
        flex-direction: row;
        align-items: center;

        margin-bottom: 6px;

        p {
          margin-right: 5px;
        }

        :global(.color-picker-controls) {
          left: 25px;
          user-select: none;
          -webkit-user-select: none;
        }

        :global(.color-picker-background) {
          background: #0000;
          z-index: 2;
        } 

        :global(.group) {
          margin: 0;
          width: 200px;
        }

        :global(input) {
          width: 190px !important;
          user-select: text;
          -webkit-user-select: text;
        }
      }

      .name input {
        width: 220px;
        margin-bottom: 6px;
      }

      .score input {
        width: 50px;
        margin-bottom: 6px;
      }
    }

    .switch {
      display: flex;
      flex-direction: row;
      align-items: center;

      margin-bottom: 10px;

      p {
        margin-right: 5px;
      }

      :global(*) {
        background-color: #0000;
      }

      :global(svg) {
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
        margin-bottom: 10px;
      }

      .team {
        --border: 2px solid #ddd;
        --borderRadius: 10px;
        --indicatorColor: #000;
        --height: 36px;

        display: flex;
        flex-direction: row;
        align-items: center;

        margin-bottom: 6px;

        p {
          margin-right: 5px;
        }

        :global(.selectContainer) {
          display: inline-flex !important;
          width: 105px;
        }

        :global(.listContainer), :global(input) {
          width: 105px;
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
    }
  }

  .play {
    position: relative;

    width: 100%;

    .players {
      position: relative;

      display: flex;
      flex-direction: column;
    }

    .add {
      width: 100%;

      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      margin-top: -10px;

      .tip {
        margin-right: auto;
        font-size: 0.8em;
      }

      p {
        margin-right: 5px;
      }

      input[type=text] {
        width: 100px;
        margin-right: 10px;
      }

      input[type=button] {
        width: 130px;
      }
    }
  }
</style>