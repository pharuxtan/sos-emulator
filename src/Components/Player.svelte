<script lang="ts">
  import ObservableSlim from "observable-slim";
  import Select from 'svelte-select';
  import Switch from "svelte-switch";
  import type SOS from "../lib/SOS";
  import type { Player, PlayerType } from "../lib/types/Player";

  export let sos: SOS;
  export let player: Player;
  export let onChange;

  let payload: PlayerType = ObservableSlim.create(player.player, true, onChange);

  let extend = false;

  function headerClick(event){
    if(event.shiftKey) player.setState(false)
    extend = !extend;
  }

  let payload_values: PlayerType = { ...player.player };

  // Name, ID

  let name = `${payload.name} [${payload.id}]`;

  player.changeName = (name_, id) => {
    name = `${name_} [${id}]`;
  }

  function inputName(){
    if(this.value == "") return;
    player.setName(this.value);
    for(let func of sos.plChFuncs){
      func(sos.players);
    }
  }

  // Team

  let teams = [
    {value: 0, label: 'BLUE'},
    {value: 1, label: 'ORANGE'}
  ];

  let team = teams[payload.team];

  function selectTeam(event) {
    payload.team = event.detail.value;
  }

  // Boost

  function filterBoost(event){
    if(!event.data) return;
    let data = event.data.replace(/[^0-9]/g, '');
    if(data == '') return event.returnValue = false;

    let start = this.selectionStart,
          end = this.selectionEnd;

    let value = [this.value.substring(0, start), data, this.value.substring(end, this.value.length)].join('');

    if(parseInt(value) > 100){
      value = "100";
      start = 3;
    }

    event.returnValue = false;
    this.value = value;

    this.setSelectionRange(start+data.length, start+data.length);
  }

  function inputBoost(){
    if(this.value == '') return payload.boost = 0;
    payload.boost = Number(this.value);
  }

  // Speed

  function inputSpeed(){
    if(this.value == '') return payload.speed = 0;
    payload.speed = parseFloat(this.value);
  }

  // Attacker

  let noneAttacker = { value: sos.nonePlayer, label: "none" };
  let attackers = [];

  attackers.push(noneAttacker);
  for(let p of sos.players){
    if(p.uniqueId == player.uniqueId) continue;
    attackers.push({ value: p, label: p.player.id});
  }

  let attacker = noneAttacker;

  if(payload.attacker != ""){
    let p = sos.players.find(p => p.player.id == payload.attacker);
    if(p) attacker = attackers.find(a => a.value == p);
  }

  sos.onPlayersChange((players) => {
    attackers.splice(0, attackers.length);
    attackers.push(noneAttacker);
    for(let p of players){
      if(p.uniqueId == player.uniqueId) continue;
      attackers.push({ value: p, label: p.player.id});
    }
    if(attacker){
      if(players.indexOf(attacker.value) == -1){
        selectAttacker({ detail: noneAttacker });
      } else if(attacker.label != attacker.value.player.id){
        attacker.label = attacker.value.player.id;
        selectAttacker({ detail: attacker });
      }
    }
    attackers = attackers;
  });

  function selectAttacker(event){
    attacker = event.detail;
    if(event.detail.label == "none"){
      payload.attacker = "";
    } else {
      payload.attacker = event.detail.label;
    }
    payload.isDead = event.detail.label != "none";
  }

  // Location

  let location = {
    x: payload.location.X,
    y :payload.location.Y,
    z: payload.location.Z,
    pitch: payload.location.pitch,
    roll: payload.location.roll,
    yaw: payload.location.yaw
  };

  function inputLocation(){
    if(this.value ==  "" || this.value == "-") return payload.location[this.id] = 0;
    payload.location[this.id] = parseFloat(this.value);
  }

  // Scoreboard

  let scoreboard = {
    score: payload.score,
    assists: payload.assists,
    demos: payload.demos,
    goals: payload.goals,
    saves: payload.saves,
    shots: payload.shots,
    touches: payload.touches,
    cartouches: payload.cartouches
  }

  function inputScoreboard(){
    if(this.value ==  "")
      payload[this.id] = 0;
    payload[this.id] = parseFloat(this.value);
  }
</script>

<player class={extend ? "extended" : ""}>
  <div class=header on:click={headerClick}>
    <p class=name>{name}</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
      <path d="m345.44 248.29l-194.29 194.28c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744l171.91-171.91-171.91-171.9c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.29 194.28c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373" transform="matrix(.03541-.00013.00013.03541 2.98 3.02)" fill="#000"/>
    </svg>
  </div>
  <div class=settings>
    <div class=separator></div>
    <div class=names>
      <p>Name: <input type=text value={payload_values.name} on:input={inputName} /></p>
      <p>Primary ID: <input type=text bind:value={payload.primary_id} /></p>
      <p>ID: <input type=text value={name.split("[")[1].split("]")[0]} readonly /></p>
      <p>Shortcut: <input type=text value={Number(name.split("_")[1].split("]")[0])-1} readonly /></p>
    </div>
    <div class=team>
      <p>Team: </p>
      <Select items={teams} value={team} on:select={selectTeam} isSearchable={false} />
    </div>
    <p class=boost>Boost: <input type=text value={payload_values.boost} on:beforeinput={filterBoost} on:input={inputBoost} /></p>
    <p>Speed: <input type=text value={payload_values.speed} on:beforeinput={sos.filter.float} on:input={inputSpeed} /></p>
    <div class=switch>
      <p>Is powersliding:</p>
      <Switch bind:checked={payload.isPowersliding} handleDiameter={0} width={42} height={20}/>
    </div>
    <div class=switch>
      <p>Is in supersonic:</p>
      <Switch bind:checked={payload.isSonic} handleDiameter={0} width={42} height={20}/>
    </div>
    <div class=switch>
      <p>Is on ground:</p>
      <Switch bind:checked={payload.onGround} handleDiameter={0} width={42} height={20}/>
    </div>
    <div class=switch>
      <p>Is on wall:</p>
      <Switch bind:checked={payload.onWall} handleDiameter={0} width={42} height={20}/>
    </div>
    <div class=attacker>
      <p>Attacker: </p>
      {#key attackers} {#key attacker}
        <Select items={attackers} value={attacker} on:select={selectAttacker} />
      {/key} {/key}
    </div>
    <p class=title>Location</p>
    <div class=location>
      <div>
        <p>X: <input id=X type=text value={location.x} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} /></p>
        <p>Y: <input id=Y type=text value={location.y} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} /></p>
        <p>Z: <input id=Z type=text value={location.z} on:beforeinput={sos.filter.coordinate} on:input={inputLocation} /></p>
      </div>
      <div>
        <p>Pitch: <input id=pitch type=text value={location.pitch} on:beforeinput={sos.filter.minus} on:input={inputLocation} /></p>
        <p>Roll: <input id=roll type=text value={location.roll} on:beforeinput={sos.filter.minus} on:input={inputLocation} /></p>
        <p>Yaw: <input id=yaw type=text value={location.yaw} on:beforeinput={sos.filter.minus} on:input={inputLocation} /></p>
      </div>
    </div>
    <p class=title>Scoreboard</p>
    <div class=scoreboard>
      <div>
        <p>Score: <input type=text id=score value={scoreboard.score} on:beforeinput={sos.filter.number} on:input={inputScoreboard} /></p>
        <p>Goals: <input type=text id=goals value={scoreboard.goals} on:beforeinput={sos.filter.number} on:input={inputScoreboard} /></p>
        <p>Assists: <input type=text id=assists value={scoreboard.assists} on:beforeinput={sos.filter.number} on:input={inputScoreboard} /></p>
        <p>Saves: <input type=text id=saves value={scoreboard.saves} on:beforeinput={sos.filter.number} on:input={inputScoreboard} /></p>
        <p>Shots: <input type=text id=shots value={scoreboard.shots} on:beforeinput={sos.filter.number} on:input={inputScoreboard} /></p>
      </div>
      <div>
        <p>Demolitions: <input type=text id=demos value={scoreboard.demos} on:beforeinput={sos.filter.number} on:input={inputScoreboard} /></p>
        <p>Ball touches: <input type=text id=touches value={scoreboard.touches} on:beforeinput={sos.filter.number} on:input={inputScoreboard} /></p>
        <p>Car touches: <input type=text id=cartouches value={scoreboard.cartouches} on:beforeinput={sos.filter.number} on:input={inputScoreboard} /></p>
      </div>
    </div>
  </div>
  <div class=delete>
    <input type=button on:click={() => player.setState(false)} value="Delete the player" />
  </div>
</player>

<style lang="scss">
  player {
    width: 100%;
    height: 50px;
    transition: height .2s ease-in-out;
    margin-bottom: 10px;

    border-radius: 12px;

    overflow: hidden;
    background-color: #eee;

    * {
      background-color: #0000;
    }

    input[type=text] {
      display: inline;

      padding: 5px 15px;
      border-radius: 10px;
      margin-bottom: 10px;
      width: 100px;

      background-color: #e1e1e1;

      font-weight: normal;
      font-size: 0.8em;
    }

    &.extended {
      height: 725px;

      svg {
        transform: rotate(-90deg) !important;
        animation: arrow-rotate-extended .2s ease-in-out 0s !important;
      }
    }

    .delete {
      width: calc(100% - 20px);
      
      display: flex;
      justify-content: flex-end;
    }

    .settings {
      position: relative;
      margin-left: 20px;

      width: calc(100% - 40px);
      height: 615px;

      .separator {
        margin-top: 0px;
        margin-bottom: 10px;
      }

      .title {
        font-size: 1.2em;
      }

      .names {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        width: calc(100% - 30px);

        p {
          width: 100px;
        }
      }

      .team {
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

      .boost input {
        width: 40px;
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

      .attacker {
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
          width: 600px;
        }

        :global(.listContainer), :global(input) {
          width: 600px;
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

      .location, .scoreboard {
        width: 100%;

        display: flex;  
        flex-direction: column;

        div {
          display: flex;
          flex-direction: row;
          justify-content: space-around;

          width: 100%;
        }
      }

      .scoreboard div {
        width: calc(100% - 30px);

        p, input {
          width: 80px;
        }

        &:nth-child(2) p {
          width: 100px;
        }
      }

      .scoreboard p, .scoreboard input {
        width: 80px;
      }
    }

    .header {
      width: 100%;
      height: 50px;
      cursor: pointer;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      p {
        margin-left: 20px;
        font-weight: 500;
        font-size: 1.1em;
        width: 650px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      svg {
        width: 20px;
        height: 20px;
        margin-right: 20px;

        transform: rotate(90deg);
        animation: arrow-rotate-base .2s ease-in-out 0s;

        @keyframes arrow-rotate-base {
          from {
            transform: rotate(-90deg);
          } to {
            transform: rotate(90deg);
          }
        }

        @keyframes arrow-rotate-extended {
          from {
            transform: rotate(90deg);
          } to {
            transform: rotate(-90deg);
          }
        }
      }
    }
  }
</style>