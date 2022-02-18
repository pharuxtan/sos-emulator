import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_round_started_go {
  event: string,
  data: string
}

export class GameRoundStartedGoPacket {
  packet: game_round_started_go;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket){
    this.ws = ws;
    this.packet = {
      event: "game:round_started_go",
      data: "game_round_started_go"
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameRoundStartedGoPacket {
    let packet = new GameRoundStartedGoPacket(this.ws);
    packet.packet = this.packet;
    return packet;
  }
}
