<script lang="ts">
  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  let game_replay_created = sos.packets.game_replay_created;

  let code = HighlightPacketJSON(game_replay_created.packet);
</script>

<game:replay_created>
  <p class=title>game:replay_created</p>
  <p class=description>This packet is sent when you open a replay.</p>
  <div class=separator></div>
  <input type=button on:click={game_replay_created.sendPacket} value="Send the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</game:replay_created>
