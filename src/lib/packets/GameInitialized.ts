import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_initialized {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameInitializedPacket {
  packet: game_initialized;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:initialized",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameInitializedPacket {
    let packet = new GameInitializedPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
