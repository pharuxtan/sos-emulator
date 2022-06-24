import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import type SOS from "../SOS";

class SOSWebSocket {
  opened: boolean = false;
  opened_before: boolean = false;
  sos: SOS;

  constructor(sos){ this.sos = sos }

  async open(port: string){
    this.opened = true;
    return invoke("init_sos_server", { port });
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