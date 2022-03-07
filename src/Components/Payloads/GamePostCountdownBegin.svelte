<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_post_countdown_begin = sos.payloads.game_post_countdown_begin;

  let code = HighlightPayloadJSON(game_post_countdown_begin.payload);
</script>

<game:post_countdown_begin>
  <p class=title>game:post_countdown_begin</p>
  <p class=description>This payload is sent to confirm that the kickoff timer has started</p>
  <div class=separator></div>
  <input type=button on:click={game_post_countdown_begin.sendPayload} value="Send the payload" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:post_countdown_begin>
