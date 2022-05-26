<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import ObservableSlim from "observable-slim";
  import Select from 'svelte-select';
  import { Categories, StatfeedEvent } from "../../lib/types/StatfeedEvent";
  import type SOS from "../../lib/SOS";
  import type { game_statfeed_event } from "../../lib/payloads/GameStatfeedEvent";

  export let sos: SOS;
  let game_statfeed_event = sos.payloads.game_statfeed_event;

  let payload: game_statfeed_event = ObservableSlim.create(game_statfeed_event.payload, true, onChange);

  let code = HighlightPayloadJSON(payload);

  function onChange(){
    code = HighlightPayloadJSON(payload);
    localStorage.setItem("game:statfeed_event", JSON.stringify(payload));
  }

  // Event

  let events = [];

  for(let key of Object.keys(StatfeedEvent)){
    let group = "";
    for(let category of Object.keys(Categories)){
      if(Categories[category].includes(key)) group = category;
    }
    events.push({
      value: key,
      label: `${StatfeedEvent[key]} [${key}]`,
      group
    });
  }

  const groupBy = (item) => item.group;

  let event = events.find(a => a.value == payload.data.event_name);

  function selectEvent(event) {
    payload.data.event_name = event.detail.value;
    payload.data.type = StatfeedEvent[event.detail.value];
  }

  // Main target

  let nonePlayer = { value: sos.nonePlayer, label: "none" };
  let mains = [];
  let secondaries = [];

  for(let p of sos.players){
    mains.push({ value: p, label: p.player.id});
  }

  let main = game_statfeed_event.main_target.isNone ? nonePlayer :  mains.find(p => p.value == game_statfeed_event.main_target);
  let secondary = nonePlayer;

  function updatePlayers(firstUpdate = false){
    if(main.value.isNone){
      secondaries = [];
      selectSecondary({ detail: nonePlayer, isFromUpdater: true });
    } else {
      secondaries.splice(0, secondaries.length);
      secondaries.push(nonePlayer);
      for(let player of sos.players){
        if(player == main.value) continue;
        secondaries.push({ value: player, label: player.player.id});
      }
      secondaries = secondaries;

      // Checks

      if(firstUpdate)
        secondary = secondaries.find(p => p.value == game_statfeed_event.secondary_target);

      if(secondary.value == main.value)
        selectSecondary({ detail: nonePlayer, isFromUpdater: true });
    }
  }

  updatePlayers(true);

  function selectMain(event){
    main = event.detail;
    game_statfeed_event.setMainTarget(event.detail.value, payload);
    updatePlayers();
  }

  function selectSecondary(event){
    secondary = event.detail;
    game_statfeed_event.setSecondaryTarget(event.detail.value, payload);
    if(!event.isFromUpdater) updatePlayers();
  }

  // Send Payload & Add to Queue

  function check(cb){
    if(!main.value.isNone) return cb();
    sos.popup.showPopup(
      "No player is triggering the event?",
      "You need to select the main target before sending this payload",
      [{
        name: "Ok" 
      }]
    );
  }

  // Reset Payload

  function resetPayload(){
    game_statfeed_event.newPayload();
    payload = ObservableSlim.create(game_statfeed_event.payload, true, onChange);
    event = events.find(a => a.value == payload.data.event_name);
    selectMain({ detail: nonePlayer });
    onChange();
  }
</script>

<game:statfeed_event>
  <p class=title>game:statfeed_event</p>
  <p class=description>This payload is sent on a new event on the game, this payload is not sent on replay</p>
  <div class=separator></div>
  <div class=select>
    <p>Event:</p>
    <Select items={events} value={event} {groupBy} on:select={selectEvent}/>
  </div>
  <p class=type>Type: <input type=text bind:value={payload.data.type} ></p>
  <div class=select>
    <p>Main target: </p>
    {#key mains} {#key main}
      <Select items={mains} value={main} noOptionsMessage="There is no player in game:update_state" on:select={selectMain} />
    {/key} {/key}
  </div>
  <div class=select>
    <p>Secondary Target: </p>
    {#key secondaries} {#key secondary}
      <Select items={secondaries} value={secondary} noOptionsMessage="Select a main target first" on:select={selectSecondary} />
    {/key} {/key}
  </div>
  <input type=button on:click={() => check(() => game_statfeed_event.sendPayload())} value="Send the payload" />
  <input type=button on:click={resetPayload} value="Reset the payload" />
  <input type=button on:click={() => check(() => sos.payloads.addToQueue(game_statfeed_event.clonePayload()))} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:statfeed_event>

<style lang="scss">
  .select {
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

  .type input {
    display: inline;

    width: 200px;
    margin-bottom: 10px;
    padding: 5px 15px;
    border-radius: 10px;

    background-color: #e1e1e1;

    font-weight: normal;
    font-size: 0.8em;
  }
</style>