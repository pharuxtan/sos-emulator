import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

class SOSWebSocket {
  opened: boolean = false;

  async open(port: string){
    this.opened = true;
    return await invoke("init_sos_server", { port });
  }
  
  send(data: string){
    appWindow.emit('sos-ws', { type: "send", data });
  }

  close(){
		appWindow.emit('sos-ws', { type: "close"});
    this.opened = false;
  }
}

export default SOSWebSocket;