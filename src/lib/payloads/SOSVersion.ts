import type SOSWebSocket from "../modules/SOSWebSocket"

export interface sos_version {
  event: string,
  data: string
}

export class SOSVersionPayload {
  payload: sos_version;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket){
    this.ws = ws;
    this.newPayload();
    if(localStorage.getItem(this.payload.event)) this.payload = JSON.parse(localStorage.getItem(this.payload.event));
  }

  newPayload(){
    this.payload = {
      event: "sos:version",
      data: "1.6.0"
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clone(): SOSVersionPayload {
    let payload = new SOSVersionPayload(this.ws);
    payload.payload = this.payload;
    return payload;
  }

  getVersion(): string {
    return this.payload.data;
  }

  setVersion(version: string){
    this.payload.data = version;
  }
}