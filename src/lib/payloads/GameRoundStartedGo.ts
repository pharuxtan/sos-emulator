import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_round_started_go {
  event: string,
  data: string
}

export class GameRoundStartedGoPayload {
  payload: game_round_started_go;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket){
    this.ws = ws;
    this.payload = {
      event: "game:round_started_go",
      data: "game_round_started_go"
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_round_started_go {
    return {...this.payload};
  }
}
