import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_pre_countdown_begin {
  event: string,
  data: {
    match_guid: string
  }
}

export class GamePreCountdownBeginPacket {
  packet: game_pre_countdown_begin;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:pre_countdown_begin",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GamePreCountdownBeginPacket {
    let packet = new GamePreCountdownBeginPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
