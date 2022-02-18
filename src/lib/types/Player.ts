import type { TeamEnum } from "./Team";

export type PlayerID = string;

export interface PlayerType {
  // Player Related
  id: PlayerID,
  primary_id: string,
  name: string,
  team: TeamEnum,

  boost: number,
  speed: number,

  isPowersliding: boolean,
  isSonic: boolean,
  onGround: boolean,
  onWall: boolean,
  
  hasCar: boolean, // Is in spectate?
  shortcut: number, // Spectator Keyboard Shortcut Key

  // Demo
  attacker: PlayerID, // Demoed by
  isDead: boolean, // IsDemo

  // Car Position
  location: {
    X: number, Y: number, Z: number,
    pitch: number, roll: number, yaw: number
  }

  // Player stat
  score: number,
  assists: number,
  demos: number,
  goals: number,
  saves: number,
  shots: number,
  touches: number, // Ball Touches
  cartouches: number // Bump
}

export class Player {
  player: PlayerType;

  constructor(id: number, name: string, team: TeamEnum, shortcut: number){
    this.player = {
      id: `${name}_${id}`,
      primary_id: ''+id,
      name,
      team,

      boost: 33,
      speed: 0,

      isPowersliding: false,
      isSonic: false,
      onGround: true,
      onWall: false,

      hasCar: true, // Should always be true
      shortcut,

      attacker: "",
      isDead: false,

      location: {
        X: 0, Y: 0, Z: 0,
        pitch: 0, roll: 0, yaw: 0
      },

      score: 0,
      assists: 0,
      demos: 0,
      goals: 0,
      saves: 0,
      shots: 0,
      touches: 0,
      cartouches: 0
    }
  }

  setName(name: string){
    this.player.name = name;
    this.player.id = `${name}_${this.player.primary_id}`;
    if(this.setState){
      this.setState(this.player.id);
    }
  }

  setState?: Function;

  setDemo(player: PlayerID){
    if(player == ""){
      this.player.attacker = "";
      this.player.isDead = false;
    } else {
      this.player.attacker = player;
      this.player.isDead = true;
    }
  }
}