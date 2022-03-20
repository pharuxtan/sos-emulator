import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_replay_created {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameReplayCreatedPayload {
  payload: game_replay_created;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:replay_created",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_replay_created {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
