import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_post_countdown_begin {
  event: string,
  data: {
    match_guid: string
  }
}

export class GamePostCountdownBeginPacket {
  packet: game_post_countdown_begin;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:post_countdown_begin",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GamePostCountdownBeginPacket {
    let packet = new GamePostCountdownBeginPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
