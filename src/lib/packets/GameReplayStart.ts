import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_replay_start {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameReplayStartPacket {
  packet: game_replay_start;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:replay_start",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify({event: "game:replay_start", data: "game_replay_start"})); // idk why this is send, but sos send it
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameReplayStartPacket {
    let packet = new GameReplayStartPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
