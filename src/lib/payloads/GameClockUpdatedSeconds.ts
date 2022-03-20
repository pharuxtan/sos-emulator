import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_clock_updated_seconds {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameClockUpdatedSecondsPayload {
  payload: game_clock_updated_seconds;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:clock_updated_seconds",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_clock_updated_seconds {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
