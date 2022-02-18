import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_podium_start {
  event: string,
  data: {
    match_guid: string
  }
}

export class GamePodiumStartPacket {
  packet: game_podium_start;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:podium_start",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GamePodiumStartPacket {
    let packet = new GamePodiumStartPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
