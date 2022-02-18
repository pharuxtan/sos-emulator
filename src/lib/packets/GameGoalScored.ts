import type SOSWebSocket from "../modules/SOSWebSocket"
import type { PlayerType } from "../types/Player";

export interface game_goal_scored {
  event: string,
  data: {
    scorer: {
      name: string,
      id: string
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

export class GameGoalScoredPacket {
  packet: game_goal_scored;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:goal_scored",
      data: { 
        scorer: {
          name: "",
          id: ""
        },
        assister: {
          name: "",
          id: ""
        },
        goaltime: 0.0,
        goalspeed: 0.0,
        ball_last_touch: {
          player: "",
          speed: 0.0
        },
        impact_location: { X: 0.0, Y:0.0 },
        match_guid: guid
      }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  setScorer(player: PlayerType){
    this.packet.data.scorer = {
      name: player.name,
      id: player.id
    }
  }

  setAssister(player?: PlayerType){
    if(player){
      this.packet.data.scorer = {
        name: player.name,
        id: player.id
      }
    } else {
      this.packet.data.scorer = {
        name: "",
        id: ""
      }
    }
  }

  setBallLastTouch(name: string, id: string, speed: number){
    this.packet.data.ball_last_touch.player = `${name}_${id}`;
    this.packet.data.ball_last_touch.speed = speed;
  }

  clone(): GameGoalScoredPacket {
    let packet = new GameGoalScoredPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
