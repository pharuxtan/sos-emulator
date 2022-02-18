import type SOSWebSocket from "../modules/SOSWebSocket"
import type { PlayerType } from "../types/Player";
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

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:statfeed_event",
      data: {
        event_name: "",
        type: "",
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
  }

  setMain(player: PlayerType){
    this.packet.data.main_target = {
      id: player.id,
      name: player.name,
      team_num: player.team
    }
  }

  setSecondary(player?: PlayerType){
    if(player){
      this.packet.data.secondary_target = {
        id: player.id,
        name: player.name,
        team_num: player.team
      }
    } else {
      this.packet.data.secondary_target = {
        id: "",
        name: "",
        team_num: TeamEnum.NONE
      }
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
  }
}
