import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_match_created {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameMatchCreatedPayload {
  payload: game_match_created;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:match_created",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_match_created {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
