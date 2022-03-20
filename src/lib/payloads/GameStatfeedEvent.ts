import type SOSWebSocket from "../modules/SOSWebSocket"
import type { Player } from "../types/Player";
import { TeamEnum } from "../types/Team";

export interface game_statfeed_event {
  event: string,
  data: {
    event_name: string,
    type: string,
    main_target: {
      id: string,
      name: string,
      team_num: TeamEnum
    },
    secondary_target: {
      id: string,
      name: string,
      team_num: TeamEnum
    }
    match_guid: string
  }
}

export class GameStatfeedEventPayload {
  payload: game_statfeed_event;
  ws: SOSWebSocket;

  main_target: Player;
  secondary_target: Player

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.newPayload(guid);
    if(localStorage.getItem(this.payload.event)) this.payload = JSON.parse(localStorage.getItem(this.payload.event));
    
    // Detect players changes
    ws.sos.onPlayersChange((players) => {
      for(let player of ["main_target", "secondary_target"]){
        if(players.indexOf(this[player]) == -1){
          this[player] = ws.sos.nonePlayer;
          this.payload.data[player] = { id: "", name: "", team_num: -1 };
        } else if(this[player].player.id != this.payload.data[player].id) {
          this.payload.data[player] = {
            id: this[player].player.id,
            name: this[player].player.name,
            team_num: this[player].player.team
          }
        }
      }
    });
  }

  newPayload(guid?: string){
    if(!guid) guid = this.payload.data.match_guid;
    this.payload = {
      event: "game:statfeed_event",
      data: {
        event_name: "Goal",
        type: "Goal",
        main_target: {
          id: "",
          name: "",
          team_num: TeamEnum.NONE
        },
        secondary_target: {
          id: "",
          name: "",
          team_num: TeamEnum.NONE
        },
        match_guid: guid
      }
    }

    // Assign players
    for(let player of ["main_target", "secondary_target"]){
      this[player] = this.ws.sos.nonePlayer;
      if(this.payload.data[player].id != ""){
        let p = this.ws.sos.players.find(p => p.player.id == this.payload.data[player].id);
        if(p) this[player] = p;
      }
    }
  }

  setMainTarget(player: Player, payload: game_statfeed_event){
    this.main_target = player;
    payload.data.main_target = {
      id: player.player.id,
      name: player.player.name,
      team_num: player.player.team
    }
  }

  setSecondaryTarget(player: Player, payload: game_statfeed_event){
    this.secondary_target = player;
    payload.data.secondary_target = {
      id: player.player.id,
      name: player.player.name,
      team_num: player.player.team
    }
  }

  sendPayload(){
    this.ws.send(JSON.stringify(this.payload));
  }

  clonePayload(): game_statfeed_event {
    return {...this.payload};
  }

  setGUID(guid: string){
    this.payload.data.match_guid = guid;
    localStorage.setItem("game:statfeed_event", JSON.stringify(this.payload));
  }
}
