import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_clock_updated_seconds {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameClockUpdatedSecondsPacket {
  packet: game_clock_updated_seconds;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:clock_updated_seconds",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameClockUpdatedSecondsPacket {
    let packet = new GameClockUpdatedSecondsPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
