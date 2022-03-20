import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_clock_stopped {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameClockStoppedPayload {
  payload: game_clock_stopped;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:clock_stopped",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_clock_stopped {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
