<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_replay_start = sos.packets.game_replay_start;

  let code = HighlightPacketJSON(game_replay_start.packet);
</script>

<game:replay_start>
  <p class=title>game:replay_start</p>
  <p class=description>This packet is sent when a goal replay start.</p>
  <div class=separator></div>
  <input type=button on:click={game_replay_start.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent (this one send 2 packets):</p>
  <pre>{@html (HighlightPacketJSON({event: "game:replay_start", data: "game_replay_start"})+"\n")}{@html code}</pre>
</game:replay_start>
