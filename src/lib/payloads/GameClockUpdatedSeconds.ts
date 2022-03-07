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

  clone(): GameClockUpdatedSecondsPayload {
    let payload = new GameClockUpdatedSecondsPayload(this.ws, this.payload.data.match_guid);
    payload.payload = this.payload;
    return payload;
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
