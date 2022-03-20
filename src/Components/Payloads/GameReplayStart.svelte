<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_replay_start = sos.payloads.game_replay_start;

  let code = HighlightPayloadJSON(game_replay_start.payload);
</script>

<game:replay_start>
  <p class=title>game:replay_start</p>
  <p class=description>This payload is sent when a goal replay start.</p>
  <div class=separator></div>
  <input type=button on:click={() => game_replay_start.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_replay_start.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent (this one send 2 payloads):</p>
  <pre>{@html (HighlightPayloadJSON({event: "game:replay_start", data: "game_replay_start"})+"\n")}{@html code}</pre>
</game:replay_start>
