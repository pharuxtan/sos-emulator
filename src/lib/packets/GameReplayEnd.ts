import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_replay_end {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameReplayEndPacket {
  packet: game_replay_end;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:replay_end",
      data: { match_guid: guid }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify({event: "game:replay_start", data: "game_replay_start"})); // idk why this is send, but sos send it
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameReplayEndPacket {
    let packet = new GameReplayEndPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
