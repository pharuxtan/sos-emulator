<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_replay_created = sos.payloads.game_replay_created;

  let code = HighlightPayloadJSON(game_replay_created.payload);
</script>

<game:replay_created>
  <p class=title>game:replay_created</p>
  <p class=description>This payload is sent when you open a replay.</p>
  <div class=separator></div>
  <input type=button on:click={() => game_replay_created.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_replay_created.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:replay_created>
