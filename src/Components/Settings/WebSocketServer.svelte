<script lang="ts">
  import type SOS from "../../lib/SOS";

  export let sos: SOS;

  let status = "CLOSED";

  if(!sos.ws.opened_before){
    sos.ws.opened_before = true
    if(sos.settings.socket_port != "0") openWebSocket(sos.settings.socket_port);
  } else if(sos.ws.opened) {
    status = "OPEN";
  }

  // Port

  let port = sos.settings.socket_port;

  function filter(event){
    if(!event.data) return;
    let data = event.data.replace(/[^0-9]/g, '');
    if(data == '') return event.returnValue = false;

    let start = this.selectionStart,
          end = this.selectionEnd;

    let value = [this.value.substring(0, start), data, this.value.substring(end, this.value.length)].join('');

    if(parseInt(value) > 49151){
      value = "49151";
      start = 5;
    }

    event.returnValue = false;
    this.value = value;
    sos.settings.socket_port = this.value == '' ? "49122" : this.value;
    localStorage.setItem("socket_port", sos.settings.socket_port);

    this.setSelectionRange(start+data.length, start+data.length);
  }

  // WebSocket

  function openOrCloseWebSocket(){
    if(status == "STARTING") return;
    if(sos.ws.opened){
      sos.ws.close();
      status = "CLOSED";
    } else {
      if(sos.settings.socket_port == "0"){
        return sos.popup.showPopup(
          `This port configuration is not supported`,
          `Sorry but actually the random port (setting port to 0) is not supported`,
          [{
            name: "Ok"
          }]
        );
      }
      openWebSocket(sos.settings.socket_port);
    }
  }

  async function openWebSocket(port: string){
    status = "STARTING";
    try {
      await sos.ws.open(port);
      return status = "OPEN";
    } catch(e){
      status = "CLOSED";
      e = e.toLowerCase();
      if(e.indexOf("permission denied") != -1){
        sos.popup.showPopup(
          `This port is reserved`,
          `The port ${port} is reserved by your system, try another one`,
          [{
            name: "Ok"
          }]
        );
      } else if(e.indexOf("already in use") != -1) {
        sos.popup.showPopup(
          `This port is already open`,
          `An external application is already using the port you want to assign to the WebSocket`,
          [{
            name: "Ok"
          }, {
            name: "Retry",
            callback: () => openWebSocket(port)
          }]
        );
      } else {
        sos.popup.showPopup(
          `An unkown error has occurred while opening the WebSocket`,
          `Error: ${e}`,
          [{
            name: "Ok"
          }]
        );
      }
    }
  }
</script>

<websocket_server>
  <p class=title>WebSocket Server</p>
  <p class=description>
    The default port of SOS is 49122
  </p>
  <div class=texts>
    <p class=status>Status: <span class={status}>{status}</span></p>
    <p class=port>Port: <input type=text value={port} on:beforeinput={filter} /></p>
  </div>
  <openorclose class=button on:click={openOrCloseWebSocket}>
    <p>{status == "CLOSED" ? "Open the WebSocket" : "Close the WebSocket"}</p>
  </openorclose>
</websocket_server>

<style lang="scss">
  websocket_server {
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

    .texts {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      width: 100%;
      margin-top: 6px;

      .status {
        font-weight: normal;
        font-size: 1.2em;
        margin-right: 10px;

        width: 168px;

        span {
          font-weight: 800;

          &.OPEN { color: #198754 }
          &.STARTING { color: #ffc107 }
          &.CLOSED { color: #dc3545 }
        }
      }

      .port {
        font-weight: normal;
        font-size: 1.2em;

        input {
          display: inline;

          width: 54px;
          padding: 5px 15px;
          border-radius: 10px;

          background-color: #E1E1E1;

          text-align: center;

          font-weight: normal;
          font-size: 0.9em;
        }
      }
    }

    openorclose {
      position: relative;
      margin: 10px auto;
      height: 50px;
      padding-right: 10px;

      display: flex;
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
  }
</style>