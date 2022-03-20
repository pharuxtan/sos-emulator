<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import ObservableSlim from "observable-slim";
  import Select from 'svelte-select';
  import type SOS from "../../lib/SOS";
  import type { game_match_ended } from "../../lib/payloads/GameMatchEnded";

  export let sos: SOS;
  let game_match_ended = sos.payloads.game_match_ended;

  let payload: game_match_ended = ObservableSlim.create(game_match_ended.payload, true, onChange);

  let code = HighlightPayloadJSON(payload);

  function onChange(){
    code = HighlightPayloadJSON(payload);
    localStorage.setItem("game:match_ended", JSON.stringify(payload));
  }

  let teams = [
    {value: 0, label: 'BLUE'},
    {value: 1, label: 'ORANGE'}
  ];

  let value = teams[payload.data.winner_team_num];

  function select(event) {
    payload.data.winner_team_num = event.detail.value;
  }

  // Reset Payload

  function resetPayload(){
    game_match_ended.newPayload();
    payload = ObservableSlim.create(game_match_ended.payload, true, onChange);
    value = teams[payload.data.winner_team_num];
    onChange();
  }
</script>

<game:match_ended>
  <p class=title>game:match_ended</p>
  <p class=description>This payload is sent when a match is ended and that the podium will start soon.</p>
  <div class=separator></div>
  <div class=team>
    <p>Winner Team: </p>
    <Select items={teams} {value} on:select={select} isSearchable={false} />
  </div>
  <input type=button on:click={() => game_match_ended.sendPayload()} value="Send the payload" />
  <input type=button on:click={resetPayload} value="Reset the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_match_ended.clonePayload())} value="Add payload to queue" />
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