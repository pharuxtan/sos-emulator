import type SOSWebSocket from "../modules/SOSWebSocket"

export interface game_replay_will_end {
  event: string,
  data: {
    match_guid: string
  }
}

export class GameReplayWillEndPayload {
  payload: game_replay_will_end;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.payload = {
      event: "game:replay_will_end",
      data: { match_guid: guid }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_replay_will_end {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
  }
}
