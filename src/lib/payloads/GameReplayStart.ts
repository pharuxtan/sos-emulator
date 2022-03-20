import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_replay_start {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameReplayStartPayload {
  payload: game_replay_start;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:replay_start",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify({event: "game:replay_start", data: "game_replay_start"})); // idk why this is send, but sos send it
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_replay_start {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
