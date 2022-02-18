export enum TeamEnum {
  NONE = -1,
  BLUE,
  ORANGE
}

export interface TeamType {
  color_primary: string,
  color_secondary: string,
  name: string,
  score: number
}