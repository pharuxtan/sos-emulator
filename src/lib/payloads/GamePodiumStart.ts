import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_podium_start {
  event: string,
  data: {
    match_guid: string
  }
}

export class GamePodiumStartPayload {
  payload: game_podium_start;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:podium_start",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_podium_start {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
