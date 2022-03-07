<script lang="ts">
  import type SOS from "../../lib/SOS";

  export let sos: SOS;

  let guid = sos.settings.match_guid;
  
  function generate(){
    guid = sos.guid();
    inputGUID.call({ value: guid });
  }

  function inputGUID() {
    sos.settings.match_guid = this.value;
    localStorage.setItem("match_guid", sos.settings.match_guid);
    sos.payloads.setGUID(guid);
  }
</script>

<match_guid>
  <p class=title>Match GUID</p>
  <p class=description>
    When you create a match, Rocket League generate a random 32 hex digit guid.<br>
    Match GUID is sended on all SOS Payloads, so you are free to edit it as you want.<br>
    Can be useful if you want to know if the payload is from SOS Emulator or not
  </p>
  <p class=guid>Match GUID: <input type=text bind:value={guid} on:input={inputGUID} /></p>
  <buttons>
    <generate class=button on:click={generate}>
      <p>Generate new one</p>
    </generate>
  </buttons>
</match_guid>

<style lang="scss">
  match_guid {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    -webkit-user-select: none;
    user-select: none;

    .title {
      margin-top: -50px;
      text-align: center;

      font-weight: 800;
      font-size: 2.5em;
    }

    .description {
      text-align: center;

      font-weight: normal;
      font-size: 1.2em;
    }

    .guid {
      margin-top: 6px;

      text-align: center;

      font-weight: normal;
      font-size: 1.2em;

      input {
        display: inline;

        width: 445px;
        padding: 5px 15px;
        border-radius: 10px;

        background-color: #E1E1E1;

        font-weight: normal;
        font-size: 1em;
      }
    }

    buttons {
      position: relative;
      margin: 10px auto;
      
      display: flex;
      flex-direction: row;
      align-items: center;

      .button {
        display: flex;
        justify-content: space-between;
        align-items: center;

        border: 2px solid #888;
        border-radius: 15px;
        
        transition: border .1s;

        &:hover {
          border: 2px solid #444;
        }

        &:active {
          border: 2px solid #000;
        }

        cursor: pointer;

        p {
          margin-left: 10px;

          font-weight: normal;
          font-size: 1.1em;
          user-select: none;
        }
      }

      generate {
        height: 50px;
        padding-right: 10px;
        margin-right: 20px;
      }
    }
  }
</style>