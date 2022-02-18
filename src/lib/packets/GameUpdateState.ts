import type SOSWebSocket from "../modules/SOSWebSocket"
import type { Player, PlayerID, PlayerType } from "../types/Player";
import type { TeamType} from "../types/Team";
import { TeamEnum } from "../types/Team";

export interface game_update_state {
  event: string,
  data: {
    event: string,
    game: {
      arena: string,
      
      time_milliseconds: number,
      time_seconds: number,

      teams: TeamType[],
      ball: {
        location: { X: number, Y: number, Z: number },
        speed: number,
        team: TeamEnum
      },

      hasTarget: boolean,
      target: PlayerID,

      hasWinner: boolean,
      winner: PlayerID,

      isOT: boolean,
      isReplay: boolean,
    }
    hasGame: boolean,
    players: {
      [player_id: PlayerID]: PlayerType
    }
    match_guid: string
  }
}

export class GameUpdateStatePacket {
  packet: game_update_state;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:update_state",
      data: {
        event: "gamestate",
        game: {
          arena: "",
          time_milliseconds: 0.0,
          time_seconds: 0,
          teams: [
            {
              color_primary: "1873FF",
              color_secondary: "E5E5E5",
              name: "BLUE",
              score: 0
            },
            {
              color_primary: "C26418",
              color_secondary: "E5E5E5",
              name: "ORANGE",
              score: 0
            }
          ],
          ball: {
            location: { X: 0.0, Y: 0.0, Z: 0.0},
            speed: 0.0,
            team: TeamEnum.BLUE
          },

          hasTarget: false,
          target: "",

          hasWinner: false,
          winner: "",

          isOT: false,
          isReplay: false
        },
        players: {},
        hasGame: true, // Should always be true
        match_guid: guid
      }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }
  
  addPlayer(playerClass: Player){
    let player: PlayerType = playerClass.player;
    let packet = this.packet, old_id = player.id;
    packet.data.players[old_id] = player;

    playerClass.setState = (id: string) => {
      delete packet.data.players[old_id];
      packet.data.players[old_id = id] = player;
    }
  }

  removePlayer(player: Player){
    delete this.packet.data.players[player.player.id];
  }

  setTime(time: number){
    this.packet.data.game.time_milliseconds = time;
    this.packet.data.game.time_seconds = Math.round(time);
  }

  clone(): GameUpdateStatePacket {
    let packet = new GameUpdateStatePacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
}
