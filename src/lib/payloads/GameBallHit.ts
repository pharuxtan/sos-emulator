import type SOSWebSocket from "../modules/SOSWebSocket"
import type { Player } from "../types/Player";

export interface game_ball_hit {
  event: string,
  data: {
    ball: {
      location: { X: number, Y: number, Z: number },
      pre_hit_speed: number,
      post_hit_speed: number
    },
    player: {
      id: string,
      name: string
    },
    match_guid: string
  }
}

export class GameBallHitPayload {
  payload: game_ball_hit;
  ws: SOSWebSocket;
  player: Player;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.newPayload(guid);
    if(localStorage.getItem(this.payload.event)) this.payload = JSON.parse(localStorage.getItem(this.payload.event));

    // Detect player changes
    this.ws.sos.onPlayersChange((players) => {
      if(players.indexOf(this.player) == -1){
        this.player = this.ws.sos.nonePlayer;
        this.payload.data.player = { id: "", name: "" };
      } else if(this.player.player.id != this.payload.data.player.id) {
        this.payload.data.player = {
          id: this.player.player.id,
          name: this.player.player.name
        }
      }
    });
  }

  newPayload(guid?: string){
    if(!guid) guid = this.payload.data.match_guid;
    this.payload = {
      event: "game:ball_hit",
      data: {
        ball: {
          location: { X: 0.0, Y: 0.0, Z: 0.0 },
          pre_hit_speed: 0.0,
          post_hit_speed: 0.0
        },
        player: { id: "", name: "" },
        match_guid: guid
      }
    }

    // Assign player
    this.player = this.ws.sos.nonePlayer;
    if(this.payload.data.player.id != ""){
      let p = this.ws.sos.players.find(p => p.player.id == this.payload.data.player.id);
      if(p) this.player = p;
    }
  }

  setPlayer(player: Player, payload: game_ball_hit){
    this.player = player;
    payload.data.player = {
      name: player.player.name,
      id: player.player.id
    };
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clone(): GameBallHitPayload {
    let payload = new GameBallHitPayload(this.ws, this.payload.data.match_guid);
    payload.payload = this.payload;
    return payload;
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
    localStorage.setItem("game:ball_hit", JSON.stringify(this.payload));
  }
}
