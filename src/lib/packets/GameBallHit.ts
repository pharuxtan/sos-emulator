import type SOSWebSocket from "../modules/SOSWebSocket"
import type { PlayerType } from "../types/Player";

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

export class GameBallHitPacket {
  packet: game_ball_hit;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
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
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameBallHitPacket {
    let packet = new GameBallHitPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setPlayer(player: PlayerType){
    this.packet.data.player = {
      name: player.name,
      id: player.id
    }
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
