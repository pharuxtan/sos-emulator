import type SOSWebSocket from "../modules/SOSWebSocket"
import{ TeamEnum } from "../types/Team";

export interface game_match_ended {
  event: string,
  data: {
    match_guid: string,
    winner_team_num: TeamEnum
  }
}

export class GameMatchEndedPacket {
  packet: game_match_ended;
  ws: SOSWebSocket;

  constructor(ws: SOSWebSocket, guid: string){
    this.ws = ws;
    this.packet = {
      event: "game:match_ended",
      data: { match_guid: guid, winner_team_num: TeamEnum.BLUE }
    }
  }

  sendPacket(){
    this.ws.send(JSON.stringify(this.packet));
  }

  clone(): GameMatchEndedPacket {
    let packet = new GameMatchEndedPacket(this.ws, this.packet.data.match_guid);
    packet.packet = this.packet;
    return packet;
  }

  setGUID(guid: string){
    this.packet.data.match_guid = guid;
  }
  
  setWinner(winner: TeamEnum){
    this.packet.data.winner_team_num = winner;
  }
}
