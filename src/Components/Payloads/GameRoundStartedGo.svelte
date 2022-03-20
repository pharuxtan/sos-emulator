<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_round_started_go = sos.payloads.game_round_started_go;

  let code = HighlightPayloadJSON(game_round_started_go.payload);
</script>

<game:round_started_go>
  <p class=title>game:round_started_go</p>
  <p class=description>This payload is sent when the players can move after the kick off timer</p>
  <div class=separator></div>
  <input type=button on:click={() => game_round_started_go.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_round_started_go.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:round_started_go>
