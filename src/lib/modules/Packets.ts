import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import type SOSWebSocket from "./SOSWebSocket";

import { GameReplayCreatedPacket, game_replay_created } from "../packets/GameReplayCreated";
import { GameBallHitPacket, game_ball_hit } from "../packets/GameBallHit";
import { GameClockStartedPacket, game_clock_started } from "../packets/GameClockStarted";
import { GameClockStoppedPacket, game_clock_stopped } from "../packets/GameClockStopped";
import { GameClockUpdatedSecondsPacket, game_clock_updated_seconds } from "../packets/GameClockUpdatedSeconds";
import { GameGoalScoredPacket, game_goal_scored } from "../packets/GameGoalScored";
import { GameInitializedPacket, game_initialized } from "../packets/GameInitialized";
import { GameMatchCreatedPacket, game_match_created } from "../packets/GameMatchCreated";
import { GameMatchDestroyedPacket, game_match_destroyed } from "../packets/GameMatchDestroyed";
import { GameMatchEndedPacket, game_match_ended } from "../packets/GameMatchEnded";
import { GamePodiumStartPacket, game_podium_start } from "../packets/GamePodiumStart";
import { GamePostCountdownBeginPacket, game_post_countdown_begin } from "../packets/GamePostCountdownBegin";
import { GamePreCountdownBeginPacket, game_pre_countdown_begin } from "../packets/GamePreCountdownBegin";
import { GameReplayEndPacket, game_replay_end } from "../packets/GameReplayEnd";
import { GameReplayStartPacket, game_replay_start } from "../packets/GameReplayStart";
import { GameReplayWillEndPacket, game_replay_will_end } from "../packets/GameReplayWillEnd";
import { GameRoundStartedGoPacket, game_round_started_go } from "../packets/GameRoundStartedGo";
import { GameStatfeedEventPacket, game_statfeed_event } from "../packets/GameStatfeedEvent";
import { GameUpdateStatePacket, game_update_state } from "../packets/GameUpdateState";
import { SOSVersionPacket, sos_version } from "../packets/SOSVersion";

export type packet = sos_version |
                                           game_update_state |
                                           game_statfeed_event |
                                           game_round_started_go |
                                           game_replay_will_end |
                                           game_replay_start |
                                           game_replay_end |
                                           game_pre_countdown_begin |
                                           game_post_countdown_begin |
                                           game_podium_start |
                                           game_match_ended |
                                           game_match_destroyed |
                                           game_match_created |
                                           game_initialized |
                                           game_goal_scored |
                                           game_clock_updated_seconds |
                                           game_clock_stopped |
                                           game_clock_started |
                                           game_ball_hit |
                                           game_replay_created;

export class Packets {
  // Packets storing
  sos_version: SOSVersionPacket;
  game_update_state: GameUpdateStatePacket;
  game_statfeed_event: GameStatfeedEventPacket;
  game_round_started_go: GameRoundStartedGoPacket;
  game_replay_will_end: GameReplayWillEndPacket;
  game_replay_start: GameReplayStartPacket;
  game_replay_end: GameReplayEndPacket;
  game_pre_countdown_begin: GamePreCountdownBeginPacket;
  game_post_countdown_begin: GamePostCountdownBeginPacket;
  game_podium_start: GamePodiumStartPacket;
  game_match_ended: GameMatchEndedPacket;
  game_match_destroyed: GameMatchDestroyedPacket;
  game_match_created: GameMatchCreatedPacket;
  game_initialized: GameInitializedPacket;
  game_goal_scored: GameGoalScoredPacket;
  game_clock_updated_seconds: GameClockUpdatedSecondsPacket;
  game_clock_stopped: GameClockStoppedPacket;
  game_clock_started: GameClockStartedPacket;
  game_ball_hit: GameBallHitPacket;
  game_replay_created: GameReplayCreatedPacket;
  
  constructor(ws: SOSWebSocket, guid: string){
    this.sos_version = new SOSVersionPacket(ws);
    this.game_update_state = new GameUpdateStatePacket(ws, guid);
    this.game_statfeed_event = new GameStatfeedEventPacket(ws, guid);
    this.game_round_started_go = new GameRoundStartedGoPacket(ws);
    this.game_replay_will_end = new GameReplayWillEndPacket(ws, guid);
    this.game_replay_start = new GameReplayStartPacket(ws, guid);
    this.game_replay_end = new GameReplayEndPacket(ws, guid);
    this.game_pre_countdown_begin = new GamePreCountdownBeginPacket(ws, guid);
    this.game_post_countdown_begin = new GamePostCountdownBeginPacket(ws, guid);
    this.game_podium_start = new GamePodiumStartPacket(ws, guid);
    this.game_match_ended = new GameMatchEndedPacket(ws, guid);
    this.game_match_destroyed = new GameMatchDestroyedPacket(ws, guid);
    this.game_match_created = new GameMatchCreatedPacket(ws, guid);
    this.game_initialized = new GameInitializedPacket(ws, guid);
    this.game_goal_scored = new GameGoalScoredPacket(ws, guid);
    this.game_clock_updated_seconds = new GameClockUpdatedSecondsPacket(ws, guid);
    this.game_clock_stopped = new GameClockStoppedPacket(ws, guid);
    this.game_clock_started = new GameClockStartedPacket(ws, guid);
    this.game_ball_hit = new GameBallHitPacket(ws, guid);
    this.game_replay_created = new GameReplayCreatedPacket(ws, guid);
  }

  setGUID(guid: string){
    this.game_update_state.setGUID(guid);
    this.game_statfeed_event.setGUID(guid);
    this.game_replay_will_end.setGUID(guid);
    this.game_replay_start.setGUID(guid);
    this.game_replay_end.setGUID(guid);
    this.game_pre_countdown_begin.setGUID(guid);
    this.game_post_countdown_begin.setGUID(guid);
    this.game_podium_start.setGUID(guid);
    this.game_match_ended.setGUID(guid);
    this.game_match_destroyed.setGUID(guid);
    this.game_match_created.setGUID(guid);
    this.game_initialized.setGUID(guid);
    this.game_goal_scored.setGUID(guid);
    this.game_clock_updated_seconds.setGUID(guid);
    this.game_clock_stopped.setGUID(guid);
    this.game_clock_started.setGUID(guid);
    this.game_ball_hit.setGUID(guid);
    this.game_replay_created.setGUID(guid);
  }

  // Queue
  packets_queue: packet[] = [];

  addToQueue(packet: packet){
    this.packets_queue.push(packet);
  }

  removeFromQueue(id: number){
    this.packets_queue.splice(id, 1);
  }

  async importJson(path: string){
    let json = JSON.parse(await readTextFile(path));
    // TODO: input json filter
    return this.packets_queue = json;
  }

  async exportJson(path: string){
    return await writeFile({ path, contents: JSON.stringify(this.packets_queue) });
  }
}