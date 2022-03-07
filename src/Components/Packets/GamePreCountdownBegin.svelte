<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_pre_countdown_begin = sos.packets.game_pre_countdown_begin;

  let code = HighlightPacketJSON(game_pre_countdown_begin.packet);
</script>

<game:pre_countdown_begin>
  <p class=title>game:pre_countdown_begin</p>
  <p class=description>This packet is sent at the start of the kickoff timer</p>
  <div class=separator></div>
  <input type=button on:click={game_pre_countdown_begin.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:pre_countdown_begin>
