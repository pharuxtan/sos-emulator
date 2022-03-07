<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_podium_start = sos.packets.game_podium_start;

  let code = HighlightPacketJSON(game_podium_start.packet);
</script>

<game:podium_start>
  <p class=title>game:podium_start</p>
  <p class=description>This packet is sent when celebration scene after the match end is shown</p>
  <div class=separator></div>
  <input type=button on:click={game_podium_start.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:podium_start>
