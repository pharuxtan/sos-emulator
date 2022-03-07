import type SOSWebSocket from "../modules/SOSWebSocket"
import type { Player } from "../types/Player";
import { TeamEnum } from "../types/Team";

export interface game_goal_scored {
  event: string,
  data: {
    scorer: {
      name: string,
      id: string,
      teamnum: TeamEnum
    },
    assister: {
      name: string,
      id: string
    },
    goaltime: number,
    goalspeed: number,
    ball_last_touch: {
      player: string,
      speed: number
    }
    impact_location: { X: number, Y: number },
    match_guid: string
  }
}

export class GameGoalScoredPayload {
  payload: game_goal_scored;
  ws: SOSWebSocket;

  scorer: Player;
  assister: Player;
  last_touch_player: Player;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.newPayload(guid);
    if(localStorage.getItem(this.payload.event)) this.payload = JSON.parse(localStorage.getItem(this.payload.event));

    // Detect players changes
    this.ws.sos.onPlayersChange((players) => {
      for(let player of ["scorer", "assister"]){
        if(players.indexOf(this[player]) == -1){
          this[player] = this.ws.sos.nonePlayer;
          this.payload.data[player] = { id: "", name: "" };
        } else if(this[player].player.id != this.payload.data[player].id) {
          this.payload.data[player] = {
            id: this[player].player.id,
            name: this[player].player.name
          }
        }
      }

      if(players.indexOf(this.last_touch_player) == -1){
        this.last_touch_player = this.ws.sos.nonePlayer;
        this.payload.data.ball_last_touch.player = "";
      } else if(this.last_touch_player.player.id != this.payload.data.ball_last_touch.player) {
        this.payload.data.ball_last_touch.player = this.last_touch_player.player.id;
      }
    });
  }

  newPayload(guid?: string){
    if(!guid) guid = this.payload.data.match_guid;
    this.payload = {
      event: "game:goal_scored",
      data: { 
        scorer: {
          name: "",
          id: "",
          teamnum: TeamEnum.NONE
        },
        assister: {
          name: "",
          id: ""
        },
        goaltime: 0,
        goalspeed: 0.0,
        ball_last_touch: {
          player: "",
          speed: 0.0
        },
        impact_location: { X: 0.0, Y:0.0 },
        match_guid: guid
      }
    }

    // Assign players
    for(let player of ["scorer", "assister"]){
      this[player] = this.ws.sos.nonePlayer;
      if(this.payload.data[player].id != ""){
        let p = this.ws.sos.players.find(p => p.player.id == this.payload.data[player].id);
        if(p) this[player] = p;
      }
    }

    this.last_touch_player = this.ws.sos.nonePlayer;
    if(this.payload.data.ball_last_touch.player != ""){
      let p = this.ws.sos.players.find(p => p.player.id == this.payload.data.ball_last_touch.player);
      if(p) this.last_touch_player = p;
    }
  }

  setScorer(player: Player, payload: game_goal_scored){
    this.scorer = player;
    payload.data.scorer = {
      id: player.player.id,
      name: player.player.name,
      teamnum: player.player.team
    }
  }

  setAssister(player: Player, payload: game_goal_scored){
    this.assister = player;
    payload.data.assister = {
      id: player.player.id,
      name: player.player.name
    }
  }

  setBallLastTouch(player: Player, payload: game_goal_scored){
    this.last_touch_player = player;
    payload.data.ball_last_touch.player = player.player.id;
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clone(): GameGoalScoredPayload {
    let payload = new GameGoalScoredPayload(this.ws, this.payload.data.match_guid);
    payload.payload = this.payload;
    return payload;
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
    localStorage.setItem("game:goal_scored", JSON.stringify(this.payload));
  }
}
