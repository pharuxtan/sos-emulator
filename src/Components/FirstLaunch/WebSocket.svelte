<script lang="ts">
  import type SOS from "../../lib/SOS";

  export let sos: SOS;
  export let state;

  let value = "49122";

  function filter(event){
    if(!event.data) return;
    let data = event.data.replace(/[^0-9]/g, '');
    if(data == '') return event.returnValue = false;

    let start = this.selectionStart,
          end = this.selectionEnd;

    value = [this.value.substring(0, start), data, this.value.substring(end, this.value.length)].join('');

    if(parseInt(value) > 49151){
      value = "49151";
      start = 5;
    }

    event.returnValue = false;
    this.value = value;

    this.setSelectionRange(start+data.length, start+data.length);
  }

  async function wsopen(){
    if(value == "0"){
      return sos.popup.showPopup(
          `This port configuration is not supported`,
          `Sorry but actually the random port (setting port to 0) is not supported`,
          [{
            name: "Go back"
          }]
        );
    }
    try  {
      sos.settings.socket_port = value;
      await sos.ws.open(value);

      state = "gameguid";
    } catch(e) {
      e = e.toLowerCase();
      if(e.indexOf("permission denied") != -1){
        sos.popup.showPopup(
          `Oops! The port you trying to open is reserved`,
          `The port ${value} is reserved by your system, try another one`,
          [{
            name: "Go back"
          }]
        );
      } else if(e.indexOf("already in use") != -1) {
        sos.popup.showPopup(
          `Oops! It seems that the port ${value} is already open`,
          `An external application is already using the port you want to assign to the WebSocket`,
          [{
            name: "Cancel"
          }, {
            name: "Retry",
            callback: wsopen
          }]
        );
      } else {
        sos.popup.showPopup(
          `We encountered an unknown error :(`,
          `Error: ${e}`,
          [{
            name: "Go back"
          }]
        );
      }
    }
  }
</script>

<websocket>
  <p class=title>Setup the WebSocket server</p>
  <p class=description>
    The default port that use SOS is 49122<br>
    Remember, the websocket port can be changed at any moment
  </p>
  <p class=port>On what port should the emulator open the WebSocket: <input type=text value="49122" on:beforeinput={filter} on:keyup={(e) => {if(e.key == "Enter") wsopen()}} /></p>
  <openws on:click={wsopen}>
    <p>Open WebSocket and continue</p>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53">
      <path d="M51.4 22.7 34.4 1.45A1 1 0 0029.4 5.45L43.9 22.7 3.9 22.7A1 1 0 003.9 30.2L43.9 30.2 29.4 47.45A1 1 0 0034.4 51.45L51.4 29.95Q54.1 26.325 51.4 22.7Z"/>
    </svg>
  </openws>
</websocket>

<style lang="scss">
  websocket {
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
      margin-top: 15px;

      text-align: center;

      font-weight: normal;
      font-size: 1.2em;
    }

    .port {
      margin-top: 10px;

      text-align: center;

      font-weight: normal;
      font-size: 1.2em;

      input {
        display: inline;

        width: 48px;
        padding: 5px 15px;
        border-radius: 10px;

        background-color: #E1E1E1;

        font-weight: normal;
        font-size: 0.8em;
        text-align: center;
      }
    }

    openws {
      margin: 10px auto;

      width: 320px;
      height: 50px;

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

      svg {
        margin-right: 10px;
        
        width: 30px;
        height: 30px;

        background-color: #0000;
      }
    }
  }
</style>