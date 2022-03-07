<script lang="ts">
  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_replay_will_end = sos.payloads.game_replay_will_end;

  let code = HighlightPayloadJSON(game_replay_will_end.payload);
</script>

<game:replay_will_end>
  <p class=title>game:replay_will_end</p>
  <p class=description>This payload is sent when a goal replay will end (mean that ball got into the goal).</p>
  <div class=separator></div>
  <input type=button on:click={game_replay_will_end.sendPayload} value="Send the payload" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:replay_will_end>
