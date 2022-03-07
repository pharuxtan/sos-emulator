<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_match_destroyed = sos.packets.game_match_destroyed;

  let code = HighlightPacketJSON(game_match_destroyed.packet);
</script>

<game:match_destroyed>
  <p class=title>game:match_destroyed</p>
  <p class=description>This packet is sent when you quit a match/replay.</p>
  <div class=separator></div>
  <input type=button on:click={game_match_destroyed.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:match_destroyed>
