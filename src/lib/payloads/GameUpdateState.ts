import type SOSWebSocket from "../modules/SOSWebSocket";
import { Player, PlayerID, PlayerType } from "../types/Player";
import type { TeamType } from "../types/Team";
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
      winner: string, // Has a value when a club (RP) match is finished

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

export class GameUpdateStatePayload {
  payload: game_update_state;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.newPayload(guid);
    if(localStorage.getItem(this.payload.event)) this.payload = JSON.parse(localStorage.getItem(this.payload.event));

    for(let player of Object.values(this.payload.data.players).sort((a,b)=>(Number(a.id.split("_").slice(-1)[0])-Number(b.id.split("_").slice(-1)[0])))){
      ws.sos.players.push(new Player(0, '', 0, player));
    }
  }

  newPayload(guid?: string){
    if(!guid) guid = this.payload.data.match_guid;
    
    // Reset players
    for(let player of this.ws.sos.players){
      player.setState(false);
    }

    this.payload = {
      event: "game:update_state",
      data: {
        event: "gamestate",
        game: {
          arena: "Stadium_P",
          time_milliseconds: 300.0,
          time_seconds: 300,
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

  fromQueue(payload: game_update_state){
    this.payload = payload;
    this.payload.data.match_guid = this.ws.sos.settings.match_guid;

    // Reset players
    for(let player of this.ws.sos.players){
      player.setState(false);
    }

    // Setup new players
    for(let player of Object.values(this.payload.data.players).sort((a,b)=>(Number(a.id.split("_").slice(-1)[0])-Number(b.id.split("_").slice(-1)[0])))){
      this.ws.sos.players.push(new Player(0, '', 0, player));
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_update_state {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
    localStorage.setItem("game:update_state", JSON.stringify(this.payload));
  }
}
