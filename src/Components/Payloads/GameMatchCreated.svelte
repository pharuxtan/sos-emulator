<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_match_created = sos.payloads.game_match_created;

  let code = HighlightPayloadJSON(game_match_created.payload);
</script>

<game:match_created>
  <p class=title>game:match_created</p>
  <p class=description>This payload is sent when you join/create a match or when you start a replay.</p>
  <div class=separator></div>
  <input type=button on:click={game_match_created.sendPayload} value="Send the payload" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:match_created>
