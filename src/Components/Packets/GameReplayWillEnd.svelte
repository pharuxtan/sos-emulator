<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_replay_will_end = sos.packets.game_replay_will_end;

  let code = HighlightPacketJSON(game_replay_will_end.packet);
</script>

<game:replay_will_end>
  <p class=title>game:replay_will_end</p>
  <p class=description>This packet is sent when a goal replay will end (mean that ball got into the goal).</p>
  <div class=separator></div>
  <input type=button on:click={game_replay_will_end.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:replay_will_end>
