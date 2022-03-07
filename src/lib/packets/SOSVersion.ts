import type SOSWebSocket from "../modules/SOSWebSocket"

export interface sos_version {
  event: string,
  data: string
}

export class SOSVersionPacket {
  packet: sos_version;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket){
    this.ws = ws;
    this.newPacket();
    if(localStorage.getItem(this.packet.event)) this.packet = JSON.parse(localStorage.getItem(this.packet.event));
  }

  newPacket(){
    this.packet = {
      event: "sos:version",
      data: "1.6.0"
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): SOSVersionPacket {
    let packet = new SOSVersionPacket(this.ws);
    packet.packet = this.packet;
    return packet;
  }

  getVersion(): string {
    return this.packet.data;
  }

  setVersion(version: string){
    this.packet.data = version;
  }
}