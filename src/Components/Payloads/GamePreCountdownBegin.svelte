<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_pre_countdown_begin = sos.payloads.game_pre_countdown_begin;

  let code = HighlightPayloadJSON(game_pre_countdown_begin.payload);
</script>

<game:pre_countdown_begin>
  <p class=title>game:pre_countdown_begin</p>
  <p class=description>This payload is sent at the start of the kickoff timer</p>
  <div class=separator></div>
  <input type=button on:click={game_pre_countdown_begin.sendPayload} value="Send the payload" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:pre_countdown_begin>
