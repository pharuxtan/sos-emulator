<script lang="ts">

  import HighlightPayloadJSON from "../../lib/modules/HighlightPayloadJSON";
  import ObservableSlim from "observable-slim";
  import type SOS from "../../lib/SOS";
  import type { sos_version } from "../../lib/payloads/SOSVersion";
import GameBallHit from "./GameBallHit.svelte";

  export let sos: SOS;
  let sos_version = sos.payloads.sos_version;

  let payload: sos_version = ObservableSlim.create(sos_version.payload, true, onChange);

  let code = HighlightPayloadJSON(payload);

  function onChange(){
    code = HighlightPayloadJSON(payload);
    localStorage.setItem("sos:version", JSON.stringify(payload));
  }

  // Reset Payload

  function resetPayload(){
    sos_version.newPayload();
    payload = ObservableSlim.create(sos_version.payload, true, onChange);
    onChange();
  }
</script>

<sos:version>
  <p class=title>sos:version</p>
  <p class=description>This payload contain the SOS version and is sended when the websocket is connected</p>
  <div class=separator></div>
  <p class=version>SOS Version: <input type=text bind:value={payload.data} /></p>
  <input type=button on:click={() => sos_version.sendPayload()} value="Send the payload" />
  <input type=button on:click={resetPayload} value="Reset the payload" />
  <input type=button on:click={() => sos.payloads.addToQueue(sos_version.clonePayload())} value="Add payload to queue" />
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