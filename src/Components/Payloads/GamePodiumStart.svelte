<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_podium_start = sos.payloads.game_podium_start;

  let code = HighlightPayloadJSON(game_podium_start.payload);
</script>

<game:podium_start>
  <p class=title>game:podium_start</p>
  <p class=description>This payload is sent when celebration scene after the match end is shown</p>
  <div class=separator></div>
  <input type=button on:click={() => game_podium_start.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_podium_start.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:podium_start>
