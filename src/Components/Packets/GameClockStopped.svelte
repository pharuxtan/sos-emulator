<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_clock_stopped = sos.packets.game_clock_stopped;

  let code = HighlightPacketJSON(game_clock_stopped.packet);
</script>

<game:clock_stopped>
  <p class=title>game:clock_stopped</p>
  <p class=description>This packet is sent when the match time is stopped.</p>
  <div class=separator></div>
  <input type=button on:click={game_clock_stopped.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:clock_stopped>
