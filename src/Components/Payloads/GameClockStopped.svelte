<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_clock_stopped = sos.payloads.game_clock_stopped;

  let code = HighlightPayloadJSON(game_clock_stopped.payload);
</script>

<game:clock_stopped>
  <p class=title>game:clock_stopped</p>
  <p class=description>This payload is sent when the match time is stopped.</p>
  <div class=separator></div>
  <input type=button on:click={() => game_clock_stopped.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_clock_stopped.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:clock_stopped>
