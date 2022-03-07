<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_post_countdown_begin = sos.packets.game_post_countdown_begin;

  let code = HighlightPacketJSON(game_post_countdown_begin.packet);
</script>

<game:post_countdown_begin>
  <p class=title>game:post_countdown_begin</p>
  <p class=description>This packet is sent to confirm that the kickoff timer has started</p>
  <div class=separator></div>
  <input type=button on:click={game_post_countdown_begin.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:post_countdown_begin>
