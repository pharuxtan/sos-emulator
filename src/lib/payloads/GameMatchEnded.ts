import type SOSWebSocket from "../modules/SOSWebSocket"
import{ TeamEnum } from "../types/Team";

export interface game_match_ended {
  event: string,
  data: {
    match_guid: string,
    winner_team_num: TeamEnum
  }
}

export class GameMatchEndedPayload {
  payload: game_match_ended;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.newPayload(guid);
    if(localStorage.getItem(this.payload.event)) this.payload = JSON.parse(localStorage.getItem(this.payload.event));
  }

  newPayload(guid?: string){
    if(!guid) guid = this.payload.data.match_guid;
    this.payload = {
      event: "game:match_ended",
      data: { match_guid: guid, winner_team_num: TeamEnum.BLUE }
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_match_ended {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
    localStorage.setItem("game:match_ended", JSON.stringify(this.payload));
  }
  
  setWinner(winner: TeamEnum){
    this.payload.data.winner_team_num = winner;
  }
}
