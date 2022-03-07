import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_initialized {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameInitializedPayload {
  payload: game_initialized;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:initialized",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clone(): GameInitializedPayload {
    let payload = new GameInitializedPayload(this.ws, this.payload.data.match_guid);
    payload.payload = this.payload;
    return payload;
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
