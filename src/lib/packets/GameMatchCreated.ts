import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_match_created {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameMatchCreatedPacket {
  packet: game_match_created;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:match_created",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameMatchCreatedPacket {
    let packet = new GameMatchCreatedPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
