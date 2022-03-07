import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_post_countdown_begin {
  event: string,
  data: {
    match_guid: string
  }
}

export class GamePostCountdownBeginPayload {
  payload: game_post_countdown_begin;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:post_countdown_begin",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clone(): GamePostCountdownBeginPayload {
    let payload = new GamePostCountdownBeginPayload(this.ws, this.payload.data.match_guid);
    payload.payload = this.payload;
    return payload;
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
