import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_clock_started {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameClockStartedPacket {
  packet: game_clock_started;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:clock_started",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameClockStartedPacket {
    let packet = new GameClockStartedPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
