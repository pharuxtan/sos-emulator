<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import ObservableSlim from "observable-slim";
  import Select from 'svelte-select';
  import type SOS from "../../lib/SOS";
  import type { game_match_ended } from "../../lib/packets/GameMatchEnded";

  export let sos: SOS;
  let game_match_ended = sos.packets.game_match_ended;

  let packet: game_match_ended = ObservableSlim.create(game_match_ended.packet, true, onChange);

  let code = HighlightPacketJSON(packet);

  function onChange(){
    code = HighlightPacketJSON(packet);
    localStorage.setItem("game:match_ended", JSON.stringify(packet));
  }

  let teams = [
    {value: 0, label: 'BLUE'},
    {value: 1, label: 'ORANGE'}
  ];

  let value = teams[packet.data.winner_team_num];

  function select(event) {
    packet.data.winner_team_num = event.detail.value;
  }

  // Reset Packet

  function resetPacket(){
    game_match_ended.newPacket();
    packet = ObservableSlim.create(game_match_ended.packet, true, onChange);
    value = teams[packet.data.winner_team_num];
    onChange();
  }
</script>

<game:match_ended>
  <p class=title>game:match_ended</p>
  <p class=description>This packet is sent when a match is ended and that the podium will start soon.</p>
  <div class=separator></div>
  <div class=team>
    <p>Winner Team: </p>
    <Select items={teams} {value} on:select={select} isSearchable={false} />
  </div>
  <input type=button on:click={game_match_ended.sendPacket} value="Send the packet" />
  <input type=button on:click={resetPacket} value="Reset the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:match_ended>

<style lang="scss">
  .team {
    --border: 2px solid #ddd;
    --borderRadius: 10px;
    --indicatorColor: #000;
    --height: 36px;

    display: flex;
    flex-direction: row;
    align-items: center;

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
</style>