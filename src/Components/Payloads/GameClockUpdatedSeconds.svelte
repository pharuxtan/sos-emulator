<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_clock_updated_seconds = sos.payloads.game_clock_updated_seconds;

  let code = HighlightPayloadJSON(game_clock_updated_seconds.payload);
</script>

<game:clock_updated_seconds>
  <p class=title>game:clock_updated_seconds</p>
  <p class=description>This payload is sent when the players can move after the kick off timer</p>
  <div class=separator></div>
  <input type=button on:click={game_clock_updated_seconds.sendPayload} value="Send the payload" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:clock_updated_seconds>
