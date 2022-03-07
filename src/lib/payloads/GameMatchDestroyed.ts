import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_match_destroyed {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameMatchDestroyedPayload {
  payload: game_match_destroyed;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:match_destroyed",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clone(): GameMatchDestroyedPayload {
    let payload = new GameMatchDestroyedPayload(this.ws, this.payload.data.match_guid);
    payload.payload = this.payload;
    return payload;
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
