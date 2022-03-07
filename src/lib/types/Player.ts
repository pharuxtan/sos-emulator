import { TeamEnum } from "./Team";

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
  cartouches: number // Bump & Demo
}

export class Player {
  player: PlayerType;
  uniqueId: string;
  deleted: boolean = false;
  isNone: boolean;

  constructor(id: number, name: string, shortcut: number, player?: PlayerType, isNone: boolean = false){
    this.isNone = isNone;
    this.uniqueId = Array(64).fill(void 0).map(a => (Math.random()*16 | 0).toString(16)).join('').toUpperCase();
    this.player = player ? player : {
      id: id == 0 ? "" : `${name}_${id}`,
      primary_id: ''+id,
      name,
      team: id == 0 ? TeamEnum.NONE : TeamEnum.BLUE,

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

  setId(id: number){
    let old_id = this.player.id;
    this.player.primary_id = ''+id;
    this.player.shortcut = id-1;
    this.player.id = `${this.player.name}_${id}`;
    this.changeName(this.player.name, this.player.id);
    if(this.setState)
      this.setState(old_id, this.player.id);
  }

  setName(name: string){
    let old_id = this.player.id;
    this.player.name = name;
    this.player.id = `${name}_${this.player.primary_id}`;
    this.changeName(this.player.name, this.player.id);
    if(this.setState)
      this.setState(old_id, this.player.id);
  }

  changeName: Function;

  setState?: Function;
}