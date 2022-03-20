import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import type SOSWebSocket from "./SOSWebSocket";

import { GameBallHitPayload, game_ball_hit } from "../payloads/GameBallHit";
import { GameClockStartedPayload, game_clock_started } from "../payloads/GameClockStarted";
import { GameClockStoppedPayload, game_clock_stopped } from "../payloads/GameClockStopped";
import { GameClockUpdatedSecondsPayload, game_clock_updated_seconds } from "../payloads/GameClockUpdatedSeconds";
import { GameGoalScoredPayload, game_goal_scored } from "../payloads/GameGoalScored";
import { GameInitializedPayload, game_initialized } from "../payloads/GameInitialized";
import { GameMatchCreatedPayload, game_match_created } from "../payloads/GameMatchCreated";
import { GameMatchDestroyedPayload, game_match_destroyed } from "../payloads/GameMatchDestroyed";
import { GameMatchEndedPayload, game_match_ended } from "../payloads/GameMatchEnded";
import { GamePodiumStartPayload, game_podium_start } from "../payloads/GamePodiumStart";
import { GamePostCountdownBeginPayload, game_post_countdown_begin } from "../payloads/GamePostCountdownBegin";
import { GamePreCountdownBeginPayload, game_pre_countdown_begin } from "../payloads/GamePreCountdownBegin";
import { GameReplayCreatedPayload, game_replay_created } from "../payloads/GameReplayCreated";
import { GameReplayEndPayload, game_replay_end } from "../payloads/GameReplayEnd";
import { GameReplayStartPayload, game_replay_start } from "../payloads/GameReplayStart";
import { GameReplayWillEndPayload, game_replay_will_end } from "../payloads/GameReplayWillEnd";
import { GameRoundStartedGoPayload, game_round_started_go } from "../payloads/GameRoundStartedGo";
import { GameStatfeedEventPayload, game_statfeed_event } from "../payloads/GameStatfeedEvent";
import { GameUpdateStatePayload, game_update_state } from "../payloads/GameUpdateState";
import { SOSVersionPayload, sos_version } from "../payloads/SOSVersion";

export type payload = sos_version |
                      game_update_state |
                      game_statfeed_event |
                      game_round_started_go |
                      game_replay_will_end |
                      game_replay_start |
                      game_replay_end |
                      game_replay_created |
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
                      game_ball_hit;

export type queue_item = {
  name: string,
  payload?: payload,
  time?: number,
  startpoint: boolean,
  breakpoint: boolean,
  executed: boolean
}

export class Payloads {
  // Payloads storing
  sos_version: SOSVersionPayload;
  game_update_state: GameUpdateStatePayload;
  game_statfeed_event: GameStatfeedEventPayload;
  game_round_started_go: GameRoundStartedGoPayload;
  game_replay_will_end: GameReplayWillEndPayload;
  game_replay_start: GameReplayStartPayload;
  game_replay_end: GameReplayEndPayload;
  game_pre_countdown_begin: GamePreCountdownBeginPayload;
  game_post_countdown_begin: GamePostCountdownBeginPayload;
  game_podium_start: GamePodiumStartPayload;
  game_match_ended: GameMatchEndedPayload;
  game_match_destroyed: GameMatchDestroyedPayload;
  game_match_created: GameMatchCreatedPayload;
  game_initialized: GameInitializedPayload;
  game_goal_scored: GameGoalScoredPayload;
  game_clock_updated_seconds: GameClockUpdatedSecondsPayload;
  game_clock_stopped: GameClockStoppedPayload;
  game_clock_started: GameClockStartedPayload;
  game_ball_hit: GameBallHitPayload;
  game_replay_created: GameReplayCreatedPayload;
  
  constructor(ws: SOSWebSocket, guid: string){
    this.sos_version = new SOSVersionPayload(ws);
    this.game_update_state = new GameUpdateStatePayload(ws, guid);
    this.game_statfeed_event = new GameStatfeedEventPayload(ws, guid);
    this.game_round_started_go = new GameRoundStartedGoPayload(ws);
    this.game_replay_will_end = new GameReplayWillEndPayload(ws, guid);
    this.game_replay_start = new GameReplayStartPayload(ws, guid);
    this.game_replay_end = new GameReplayEndPayload(ws, guid);
    this.game_pre_countdown_begin = new GamePreCountdownBeginPayload(ws, guid);
    this.game_post_countdown_begin = new GamePostCountdownBeginPayload(ws, guid);
    this.game_podium_start = new GamePodiumStartPayload(ws, guid);
    this.game_match_ended = new GameMatchEndedPayload(ws, guid);
    this.game_match_destroyed = new GameMatchDestroyedPayload(ws, guid);
    this.game_match_created = new GameMatchCreatedPayload(ws, guid);
    this.game_initialized = new GameInitializedPayload(ws, guid);
    this.game_goal_scored = new GameGoalScoredPayload(ws, guid);
    this.game_clock_updated_seconds = new GameClockUpdatedSecondsPayload(ws, guid);
    this.game_clock_stopped = new GameClockStoppedPayload(ws, guid);
    this.game_clock_started = new GameClockStartedPayload(ws, guid);
    this.game_ball_hit = new GameBallHitPayload(ws, guid);
    this.game_replay_created = new GameReplayCreatedPayload(ws, guid);
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
  payloads_queue: queue_item[] = JSON.parse(localStorage.getItem("queue") || "[]");

  addToQueue(payload: payload){
    this.payloads_queue.push({
      name: payload.event,
      payload,
      startpoint: false,
      breakpoint: false,
      executed: false
    });
    this.saveQueue();
  }

  saveQueue(){
    localStorage.setItem("queue", JSON.stringify(this.payloads_queue));
  }

  async importJson(path){
    let queue: queue_item[] = [];
    try {
      let json = JSON.parse(await readTextFile(path));
      if(!Array.isArray(json)) throw { message: "JSON is not an array" };
      for(let item of json){
        if(!item.event || typeof item.event != "string") continue;
        if(item.event == "time"){
          queue.push({
            name: "Timer",
            time: item.time,
            startpoint: false,
            breakpoint: false,
            executed: false
          });
        } else {
          queue.push({
            name: item.event,
            payload: item,
            startpoint: false,
            breakpoint: false,
            executed: false
          });
        }
      }
    } catch(e){
      throw e;
    }
    return queue;
  }

  async exportJson(path: string){
    let json = [];
    for(let item of this.payloads_queue){
      if(item.name == "Timer"){
        json.push({
          event: "time",
          time: item.time
        })
      } else {
        json.push(item.payload);
      }
    }
    return await writeFile({ path, contents: JSON.stringify(json) });
  }

  payload_info = class PayloadInfo {
    static toggle: Function;
    static index: number;
    static item: queue_item;
  }

  record_rl: Function;
}