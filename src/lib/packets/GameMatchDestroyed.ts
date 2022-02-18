import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_match_destroyed {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameMatchDestroyedPacket {
  packet: game_match_destroyed;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:match_destroyed",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameMatchDestroyedPacket {
    let packet = new GameMatchDestroyedPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
