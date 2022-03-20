<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_replay_end = sos.payloads.game_replay_end;

  let code = HighlightPayloadJSON(game_replay_end.payload);
</script>

<game:replay_end>
  <p class=title>game:replay_end</p>
  <p class=description>This payload is sent when a goal replay end.</p>
  <div class=separator></div>
  <input type=button on:click={() => game_replay_end.sendPayload()} value="Send the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(game_replay_end.clonePayload())} value="Add payload to queue" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:replay_end>
