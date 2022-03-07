<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_clock_updated_seconds = sos.packets.game_clock_updated_seconds;

  let code = HighlightPacketJSON(game_clock_updated_seconds.packet);
</script>

<game:clock_updated_seconds>
  <p class=title>game:clock_updated_seconds</p>
  <p class=description>This packet is sent when the players can move after the kick off timer</p>
  <div class=separator></div>
  <input type=button on:click={game_clock_updated_seconds.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:clock_updated_seconds>
