<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import ObservableSlim from "observable-slim";
  import Select from 'svelte-select';
  import type SOS from "../../lib/SOS";
  import type { game_ball_hit } from "../../lib/packets/GameBallHit";

  export let sos: SOS;
  let game_ball_hit = sos.packets.game_ball_hit;

  let packet: game_ball_hit = ObservableSlim.create(game_ball_hit.packet, true, onChange);

  let code = HighlightPacketJSON(packet);

  function onChange(){
    code = HighlightPacketJSON(packet);
    localStorage.setItem("game:ball_hit", JSON.stringify(packet));
  }

  // Players

  let nonePlayer = { value: sos.nonePlayer, label: "none" };
  let players = [];

  for(let p of sos.players){
    players.push({ value: p, label: p.player.id});
  }

  let player = game_ball_hit.player.isNone ? nonePlayer : players.find(p => p.value == game_ball_hit.player);

  function selectPlayer(event){
    game_ball_hit.setPlayer(event.detail.value, packet);
  }

  // Ball

  let ball = {
    x: packet.data.ball.location.X,
    y :packet.data.ball.location.Y,
    z: packet.data.ball.location.Z,
    pre_speed: packet.data.ball.pre_hit_speed,
    post_speed: packet.data.ball.post_hit_speed
  };

  function inputLocation(){
    if(this.value ==  "" || this.value == "-") return packet.data.ball.location[this.id] = 0;
    packet.data.ball.location[this.id] = parseFloat(this.value);
  }

  function inputPreSpeed(){
    let speed = parseFloat(this.value == "" ? 0 : this.value);
    packet.data.ball.pre_hit_speed = speed;
  }

  function inputPostSpeed(){
    let speed = parseFloat(this.value == "" ? 0 : this.value);
    packet.data.ball.post_hit_speed = speed;
  }

  // Send Packet

  function sendPacket(){
    if(!player.value.isNone) return game_ball_hit.sendPacket();
    sos.popup.showPopup(
      "No player is touching the ball?",
      "You need to select a player before sending this packet",
      [{
        name: "Ok"
      }]
    );
  }

  // Reset Packet

  function resetPacket(){
    game_ball_hit.newPacket();
    packet = ObservableSlim.create(game_ball_hit.packet, true, onChange);
    player = game_ball_hit.player.isNone ? nonePlayer : players.find(p => p.value == game_ball_hit.player);
    ball = {
      x: packet.data.ball.location.X,
      y :packet.data.ball.location.Y,
      z: packet.data.ball.location.Z,
      pre_speed: packet.data.ball.pre_hit_speed,
      post_speed: packet.data.ball.post_hit_speed
    }
    onChange();
  }
</script>

<game:ball_hit>
  <p class=title>game:ball_hit</p>
  <p class=description>This packet is sent when a player touch the ball.</p>
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
  <input type=button on:click={sendPacket} value="Send the packet" />
  <input type=button on:click={resetPacket} value="Reset the packet" />
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