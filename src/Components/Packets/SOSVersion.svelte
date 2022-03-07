<script lang="ts">

  import HighlightPacketJSON from "../../lib/modules/HighlightPacketJSON";
  import ObservableSlim from "observable-slim";
  import type SOS from "../../lib/SOS";
  import type { sos_version } from "../../lib/packets/SOSVersion";

  export let sos: SOS;
  let sos_version = sos.packets.sos_version;

  let packet: sos_version = ObservableSlim.create(sos_version.packet, true, onChange);

  let code = HighlightPacketJSON(packet);

  function onChange(){
    code = HighlightPacketJSON(packet);
    localStorage.setItem("sos:version", JSON.stringify(packet));
  }

  // Reset Packet

  function resetPacket(){
    sos_version.newPacket();
    packet = ObservableSlim.create(sos_version.packet, true, onChange);
    onChange();
  }
</script>

<sos:version>
  <p class=title>sos:version</p>
  <p class=description>This packet contain the SOS version and is sended when the websocket is connected</p>
  <div class=separator></div>
  <p class=version>SOS Version: <input type=text bind:value={packet.data} /></p>
  <input type=button on:click={sos_version.sendPacket} value="Send the packet" />
  <input type=button on:click={resetPacket} value="Reset the packet" />
  <p class=sent>What will be sent:</p>
  <pre>{@html code}</pre>
</sos:version>

<style lang="scss">
  .version {
      margin-top: 10px;

      input {
        display: inline;

        width: 80px;
        padding: 5px 15px;
        border-radius: 10px;

        background-color: #E1E1E1;

        font-weight: normal;
        font-size: 0.8em;
        text-align: center;
      }
    }
</style>