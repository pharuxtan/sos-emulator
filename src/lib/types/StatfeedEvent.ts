export enum StatfeedEvent {
  // Winner
  Win = "Win",
  MVP = "MVP",

  // Goals
  Goal = "Goal",
  OvertimeGoal = "Overtime Goal",
  AerialGoal = "Aerial Goal",
  BackwardsGoal = "Backwards Goal",
  BicycleGoal = "Bicycle Goal",
  LongGoal = "Long Goal",
  TurtleGoal = "Turtle Goal",
  HoopsSwishGoal = "Swish Goal",

  // Assists
  Assist = "Assist",
  Playmaker = "Playmaker",

  // Saves
  Save = "Save",
  EpicSave = "Epic Save",
  Savior = "Savior",

  // Shots
  Shot = "Shot on Goal",
  PoolShot = "Pool Shot",

  // Demolitions
  Demolish = "Demolition",
  Demolition = "Extermination",

  // Dropshot
  BreakoutDamage = "Damage",
  BreakoutDamageLarge = "Ultra Damage",

  // Miscellaneous
  BicycleHit = "Bicycle Hit",
  HatTrick = "Hat Trick",
  HighFive = "High Five",
  LowFive = "Low Five"
}

export const Categories = {
  "Winner": ["Win", "MVP"],
  "Goals": ["Goal", "OvertimeGoal", "AerialGoal", "BackwardsGoal", "BicycleGoal", "LongGoal", "TurtleGoal", "HoopsSwishGoal"],
  "Assists": ["Assist", "Playmaker"],
  "Saves": ["Save", "EpicSave", "Savior"],
  "Shots": ["Shot", "PoolShot"],
  "Demolitions": ["Demolish", "Demolition"],
  "Dropshot": ["BreakoutDamage", "BreakoutDamageLarge"],
  "Miscellaneous": ["BicycleHit", "HatTrick", "HighFive", "LowFive"]
}