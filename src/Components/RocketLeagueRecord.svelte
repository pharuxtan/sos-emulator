<script lang="ts">
  import type SOS from "src/lib/SOS";

  export let sos: SOS;

  let host = "localhost";
  let port = "49122";

  function filter(event){
    if(!event.data) return port = this.value.split('').slice(0, -1).join('');
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
    this.value = port = value;

    this.setSelectionRange(start+data.length, start+data.length);
  }

  let disable = false;
  let connect = "Connect";

  let log = "";
  let ws;
  let quitting = false;

  async function connectToWS(){
    if(!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/.test(host) && !/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host) && host != "localhost"){
      return sos.popup.showPopup("Host is invalid", "Please enter a valid host name like localhost or 127.0.0.1", [{ name: "Ok" }]);
    }
    if(port == sos.settings.socket_port && sos.ws.opened){
      sos.ws.close();
      await new Promise((r) => {
        sos.popup.showPopup("Emulator WebSocket has been closed", "Due to the port that is the same as the emulator, the WebSocket as been closed, to reopen it go to WebSocket Server settings", [{ name: "Ok", callback: r }])
      })
    }
    disable = true;
    connect = "Connecting...";
    ws = new WebSocket(`ws://${host}:${port}`);
    ws.addEventListener("error", (err) => {
      if(quitting) return;
      ws = undefined;
      sos.popup.showPopup("Could not connect to WebSocket", "The WebSocket you trying to listen on is not avalaible", [{ name: "Ok" }])
    });
    ws.addEventListener("open", () => {
      connect = "Connected!";
      log += "WebSocket connection opened\n";
    });
    ws.addEventListener("close", () => {
      ws = undefined;
      log += "WebSocket connection closed\n";
      disable = false;
      connect = "Connect";
    });

    let date = undefined;
    ws.addEventListener("message", (msg) => {
      try {
        let payload = JSON.parse(msg.data);
        if(!payload.event || typeof payload.event != "string") return;
        let time = 0;
        let now = Date.now();
        if(date) time = now - date;
        date = now;
        if(time != 0){
          sos.payloads.payloads_queue.push({
            name: "Timer",
            time,
            breakpoint: false,
            startpoint: false,
            executed: false
          });
        }
        sos.payloads.payloads_queue.push({
          name: payload.event,
          payload,
          breakpoint: false,
          startpoint: false,
          executed: false
        });
        log += `Received ${payload.event}\n`;
      } catch(e){}
    })
  }

  function quit(){
    quitting = true;
    if(ws) ws.close();  
    sos.payloads.record_rl(false);
  }
</script>

<background>
  <rl_record>
    <p class=host>What host should i listen to: <input type=text bind:value={host} disabled={disable}/></p>
    <p>What port should i listen to: <input type=text value="49122" on:beforeinput={filter} disabled={disable}/></p>
    <input type=button class=connect on:click={connectToWS} value={connect} disabled={disable}>
    <pre>{log}</pre>
    <input type=button class=quit on:click={quit} value="Quit" />
  </rl_record>
</background>

<style lang="scss">
  background {
    position: fixed;
    top: 0px;
    left: 0px;

    z-index: 999;

    width: 100%;
    height: 100%;

    background-color: #00000020;

    rl_record {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      width: 500px;
      height: 400px;

      display: flex;
      flex-direction: column;
      align-items: center;

      border-radius: 15px;
      padding: 20px 25px;
      
      background-color: #FFFFFF;
      box-shadow: 0 3px 2px -2px gray;

      p {
        margin-bottom: 10px;

        font-weight: normal;
        font-size: 1.1em;

        &.host input {
          width: 120px;
        }

        input {
          display: inline;

          width: 48px;
          padding: 5px 15px;
          border-radius: 10px;

          background-color: #E1E1E1;

          text-align: center;

          font-weight: normal;
          font-size: 0.8em;
        }
      }

      .connect, .quit {
        padding: 10px 0;
        border-radius: 50px;

        margin-left: 15px;

        width: 140px;
          
        cursor: pointer;

        font-size: 1em;
          
        transition: background-color .1s;
        background-color: #E1E1E1;

        &:hover {
          background-color: #dadada;
        }

        &:active {
          background-color: #d1d1d1;
        }

        box-shadow: rgb(255 255 255 / 0%) 0 0 0 3px, rgb(0 102 255 / 0%) 0 0 0 4px;
      }

      .connect:disabled {
        color: #555;
      }

      .quit {
        padding: 10px 30px;
        width: auto;

        position: absolute;
        right: 15px;
        bottom: 15px;
      }

      pre {
        width: 400px;
        height: 210px;
        overflow: auto;
      }
    }
  }
</style>