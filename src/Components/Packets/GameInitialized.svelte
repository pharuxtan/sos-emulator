<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_initialized = sos.packets.game_initialized;

  let code = HighlightPacketJSON(game_initialized.packet);
</script>

<game:initialized>
  <p class=title>game:initialized</p>
  <p class=description>This packet is sent when all player as joined and that the match is about to start.</p>
  <div class=separator></div>
  <input type=button on:click={game_initialized.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:initialized>
