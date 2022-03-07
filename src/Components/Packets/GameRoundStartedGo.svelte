<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_round_started_go = sos.packets.game_round_started_go;

  let code = HighlightPacketJSON(game_round_started_go.packet);
</script>

<game:round_started_go>
  <p class=title>game:round_started_go</p>
  <p class=description>This packet is sent when the players can move after the kick off timer</p>
  <div class=separator></div>
  <input type=button on:click={game_round_started_go.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:round_started_go>
