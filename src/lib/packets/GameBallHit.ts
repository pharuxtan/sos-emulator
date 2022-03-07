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

export class GameBallHitPacket {
  packet: game_ball_hit;
  ws: SOSWebSocket;
  player: Player;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.newPacket(guid);
    if(localStorage.getItem(this.packet.event)) this.packet = JSON.parse(localStorage.getItem(this.packet.event));

    // Detect player changes
    this.ws.sos.onPlayersChange((players) => {
      if(players.indexOf(this.player) == -1){
        this.player = this.ws.sos.nonePlayer;
        this.packet.data.player = { id: "", name: "" };
      } else if(this.player.player.id != this.packet.data.player.id) {
        this.packet.data.player = {
          id: this.player.player.id,
          name: this.player.player.name
        }
      }
    });
  }

  newPacket(guid?: string){
    if(!guid) guid = this.packet.data.match_guid;
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

    // Assign player
    this.player = this.ws.sos.nonePlayer;
    if(this.packet.data.player.id != ""){
      let p = this.ws.sos.players.find(p => p.player.id == this.packet.data.player.id);
      if(p) this.player = p;
    }
  }

  setPlayer(player: Player, packet: game_ball_hit){
    this.player = player;
    packet.data.player = {
      name: player.player.name,
      id: player.player.id
    };
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameBallHitPacket {
    let packet = new GameBallHitPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
    localStorage.setItem("game:ball_hit", JSON.stringify(this.packet));
  }
}
