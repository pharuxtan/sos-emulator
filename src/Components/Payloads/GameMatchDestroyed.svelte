<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_match_destroyed = sos.payloads.game_match_destroyed;

  let code = HighlightPayloadJSON(game_match_destroyed.payload);
</script>

<game:match_destroyed>
  <p class=title>game:match_destroyed</p>
  <p class=description>This payload is sent when you quit a match/replay.</p>
  <div class=separator></div>
  <input type=button on:click={() => game_match_destroyed.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_match_destroyed.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:match_destroyed>
