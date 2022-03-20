<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_initialized = sos.payloads.game_initialized;

  let code = HighlightPayloadJSON(game_initialized.payload);
</script>

<game:initialized>
  <p class=title>game:initialized</p>
  <p class=description>This payload is sent when all player as joined and that the match is about to start.</p>
  <div class=separator></div>
  <input type=button on:click={() => game_initialized.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_initialized.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:initialized>
