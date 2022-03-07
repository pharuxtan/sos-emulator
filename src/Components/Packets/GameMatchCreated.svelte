<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_match_created = sos.packets.game_match_created;

  let code = HighlightPacketJSON(game_match_created.packet);
</script>

<game:match_created>
  <p class=title>game:match_created</p>
  <p class=description>This packet is sent when you join/create a match or when you start a replay.</p>
  <div class=separator></div>
  <input type=button on:click={game_match_created.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:match_created>
