<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_clock_updated_seconds = sos.payloads.game_clock_updated_seconds;

  let code = HighlightPayloadJSON(game_clock_updated_seconds.payload);
</script>

<game:clock_updated_seconds>
  <p class=title>game:clock_updated_seconds</p>
  <p class=description>This payload is sent when the seconds of the clock are updated</p>
  <div class=separator></div>
  <input type=button on:click={() => game_clock_updated_seconds.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_clock_updated_seconds.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:clock_updated_seconds>
