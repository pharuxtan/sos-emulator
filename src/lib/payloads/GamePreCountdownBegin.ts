import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_pre_countdown_begin {
  event: string,
  data: {
    match_guid: string
  }
}

export class GamePreCountdownBeginPayload {
  payload: game_pre_countdown_begin;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:pre_countdown_begin",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_pre_countdown_begin {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
