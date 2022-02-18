import SOSWebSocket from "./modules/SOSWebSocket";
import Popup from "./modules/Popup";

interface settings {
  first_launch: boolean,
  socket_port: string,
  match_guid: string
}

class SOS {
  ws: SOSWebSocket;
  popup: Popup;

  settings: settings;
  updateFirstLaunch: Function;

  constructor(){
    this.ws = new SOSWebSocket();
    this.popup = new Popup();

    if(localStorage.getItem("first_launch") == null) localStorage.setItem("first_launch", "true");
    if(localStorage.getItem("socket_port") == null) localStorage.setItem("socket_port", "49122");
    if(localStorage.getItem("match_guid") == null) localStorage.setItem("match_guid", this.guid());
    this.settings = {
      first_launch: localStorage.getItem("first_launch") == "true",
      socket_port: localStorage.getItem("socket_port"),
      match_guid: localStorage.getItem("match_guid")
    }
  }

  guid(){
    let id = "";
    for(let i=0; i<32; i++)
      id += (Math.random()*16 | 0).toString(16);
    return id.toUpperCase();
  }
}

export default SOS;