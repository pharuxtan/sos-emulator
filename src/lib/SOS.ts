import SOSWebSocket from "./modules/SOSWebSocket";
import Popup from "./modules/Popup";
import { Packets } from "./modules/Packets";
import { Player } from "./types/Player";
import Filter from "./modules/Filter";

interface settings {
  first_launch: boolean,
  socket_port: string,
  match_guid: string
}

class SOS {
  ws: SOSWebSocket = new SOSWebSocket(this);
  popup: Popup = new Popup();
  filter: Filter = new Filter();
  packets: Packets;
  
  players: Player[] = [];
  nonePlayer: Player = new Player(0, "", -1, undefined, true);

  settings: settings;
  updateFirstLaunch: Function;

  constructor(){
    (<any>window).sos = this;

    if(localStorage.getItem("first_launch") == null) localStorage.setItem("first_launch", "true");
    if(localStorage.getItem("socket_port") == null) localStorage.setItem("socket_port", "49122");
    if(localStorage.getItem("match_guid") == null) localStorage.setItem("match_guid", this.guid());
    this.settings = {
      first_launch: localStorage.getItem("first_launch") == "true",
      socket_port: localStorage.getItem("socket_port"),
      match_guid: localStorage.getItem("match_guid")
    }

    this.packets = new Packets(this.ws, this.settings.match_guid);
  }

  plChFuncs: Function[] = [];

  onPlayersChange(func: Function){
    this.plChFuncs.push(func);
  }

  guid(){
    let id = "";
    for(let i=0; i<32; i++)
      id += (Math.random()*16 | 0).toString(16);
    return id.toUpperCase();
  }
}

export default SOS;