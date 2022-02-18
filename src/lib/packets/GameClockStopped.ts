import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_clock_stopped {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameClockStoppedPacket {
  packet: game_clock_stopped;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:clock_stopped",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameClockStoppedPacket {
    let packet = new GameClockStoppedPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
