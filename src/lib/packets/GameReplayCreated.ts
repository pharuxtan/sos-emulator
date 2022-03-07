import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_replay_created {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameReplayCreatedPacket {
  packet: game_replay_created;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:replay_created",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameReplayCreatedPacket {
    let packet = new GameReplayCreatedPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
