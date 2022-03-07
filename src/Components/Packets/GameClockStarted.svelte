<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_clock_started = sos.packets.game_clock_started;

  let code = HighlightPacketJSON(game_clock_started.packet);
</script>

<game:clock_started>
  <p class=title>game:clock_started</p>
  <p class=description>This packet is sent when the match time is started</p>
  <div class=separator></div>
  <input type=button on:click={game_clock_started.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:clock_started>
