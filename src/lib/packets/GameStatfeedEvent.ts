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

export class GameStatfeedEventPacket {
  packet: game_statfeed_event;
  ws: SOSWebSocket;

  main_target: Player;
  secondary_target: Player

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.newPacket(guid);
    if(localStorage.getItem(this.packet.event)) this.packet = JSON.parse(localStorage.getItem(this.packet.event));
    
    // Detect players changes
    ws.sos.onPlayersChange((players) => {
      for(let player of ["main_target", "secondary_target"]){
        if(players.indexOf(this[player]) == -1){
          this[player] = ws.sos.nonePlayer;
          this.packet.data[player] = { id: "", name: "", team_num: -1 };
        } else if(this[player].player.id != this.packet.data[player].id) {
          this.packet.data[player] = {
            id: this[player].player.id,
            name: this[player].player.name,
            team_num: this[player].player.team
          }
        }
      }
    });
  }

  newPacket(guid?: string){
    if(!guid) guid = this.packet.data.match_guid;
    this.packet = {
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
      if(this.packet.data[player].id != ""){
        let p = this.ws.sos.players.find(p => p.player.id == this.packet.data[player].id);
        if(p) this[player] = p;
      }
    }
  }

  setMainTarget(player: Player, packet: game_statfeed_event){
    this.main_target = player;
    packet.data.main_target = {
      id: player.player.id,
      name: player.player.name,
      team_num: player.player.team
    }
  }

  setSecondaryTarget(player: Player, packet: game_statfeed_event){
    this.secondary_target = player;
    packet.data.secondary_target = {
      id: player.player.id,
      name: player.player.name,
      team_num: player.player.team
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameStatfeedEventPacket {
    let packet = new GameStatfeedEventPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
    localStorage.setItem("game:statfeed_event", JSON.stringify(this.packet));
  }
}
