<script lang="ts">
	import { slideDownIn, slideDownOut, slideUpIn, slideUpOut } from "../lib/modules/Transitions";
  import type SOS from "../lib/SOS";
  export let sos: SOS;

	/* Payloads */
	import SosVersion from "./Payloads/SOSVersion.svelte";
	import GameUpdateState from "./Payloads/GameUpdateState.svelte";
	import GameClockStopped from "./Payloads/GameClockStopped.svelte";
	import GameReplayCreated from "./Payloads/GameReplayCreated.svelte";
	import GameMatchCreated from "./Payloads/GameMatchCreated.svelte";
	import GameInitialized from "./Payloads/GameInitialized.svelte";
	import GamePreCountdownBegin from "./Payloads/GamePreCountdownBegin.svelte";
	import GamePostCountdownBegin from "./Payloads/GamePostCountdownBegin.svelte";
	import GameRoundStartedGo from "./Payloads/GameRoundStartedGo.svelte";
	import GameClockStarted from "./Payloads/GameClockStarted.svelte";
	import GameBallHit from "./Payloads/GameBallHit.svelte";
	import GameClockUpdatedSeconds from "./Payloads/GameClockUpdatedSeconds.svelte";
	import GameStatfeedEvent from "./Payloads/GameStatfeedEvent.svelte";
	import GameGoalScored from "./Payloads/GameGoalScored.svelte";
	import GameReplayStart from "./Payloads/GameReplayStart.svelte";
	import GameReplayWillEnd from "./Payloads/GameReplayWillEnd.svelte";
	import GameReplayEnd from "./Payloads/GameReplayEnd.svelte";
	import GameMatchEnded from "./Payloads/GameMatchEnded.svelte";
	import GamePodiumStart from "./Payloads/GamePodiumStart.svelte";
	import GameMatchDestroyed from "./Payloads/GameMatchDestroyed.svelte";

	/* Features */
	import PayloadsQueue from "./Features/PayloadsQueue.svelte";
	import ReplaySimulator from "./Features/ReplaySimulator.svelte";

	/* Settings */
	import WebSocketServer from "./Settings/WebSocketServer.svelte";
	import MatchGuid from "./Settings/MatchGUID.svelte";
	import AboutSosEmulator from "./Settings/AboutSOSEmulator.svelte";

	let pages = {
		/* Payloads */
		sos_version: SosVersion,
		game_update_state: GameUpdateState,
		game_clock_stopped: GameClockStopped,
		game_replay_created: GameReplayCreated,
		game_match_created: GameMatchCreated,
		game_initialized: GameInitialized,
		game_pre_countdown_begin: GamePreCountdownBegin,
		game_post_countdown_begin: GamePostCountdownBegin,
		game_round_started_go: GameRoundStartedGo,
		game_clock_started: GameClockStarted,
		game_ball_hit : GameBallHit,
		game_clock_updated_seconds: GameClockUpdatedSeconds,
		game_statfeed_event: GameStatfeedEvent,
		game_goal_scored: GameGoalScored,
		game_replay_start: GameReplayStart,
		game_replay_will_end: GameReplayWillEnd,
		game_replay_end: GameReplayEnd,
		game_match_ended: GameMatchEnded,
		game_podium_start: GamePodiumStart,
		game_match_destroyed: GameMatchDestroyed,

		/* Features */
		payloads_queue: PayloadsQueue,
		replay_simulator: ReplaySimulator,

		/* Settings */
		websocket_server: WebSocketServer,
		match_guid: MatchGuid,
		about_sos_emulator: AboutSosEmulator
	}

	let page = "websocket_server";

	let transitionIn = (..._) => { return {} };
	let transitionOut = (..._) => { return {} };

	function sidebar(event){
		let element = event.target;
		if(element.nodeName == "INPUT"){
			let indexes = Object.keys(pages);
			if(indexes.indexOf(page) < indexes.indexOf(element.id)){
				transitionIn = slideDownIn;
				transitionOut = slideDownOut;
			} else {
				transitionIn = slideUpIn;
				transitionOut = slideUpOut;
			}
			page = element.id;
		}
	}
</script>

<main>
	<sidebar on:click={sidebar}>
		<category>
			<p class=title>Payloads</p>
			<contents>
				<input type=button id=sos_version value="sos:version" disabled={page == "sos_version"} />
				<input type=button id=game_update_state value="game:update_state" disabled={page == "game_update_state"} />
				<input type=button id=game_clock_stopped value="game:clock_stopped" disabled={page == "game_clock_stopped"} />
				<input type=button id=game_replay_created value="game:replay_created" disabled={page == "game_replay_created"} />
				<input type=button id=game_match_created value="game:match_created" disabled={page == "game_match_created"} />
				<input type=button id=game_initialized value="game:initialized" disabled={page == "game_initialized"} />
				<input type=button id=game_pre_countdown_begin value="game:pre_countdown_begin" disabled={page == "game_pre_countdown_begin"} />
				<input type=button id=game_post_countdown_begin value="game:post_countdown_begin" disabled={page == "game_post_countdown_begin"} />
				<input type=button id=game_round_started_go value="game:round_started_go" disabled={page == "game_round_started_go"} />
				<input type=button id=game_clock_started value="game:clock_started" disabled={page == "game_clock_started"} />
				<input type=button id=game_ball_hit value="game:ball_hit" disabled={page == "game_ball_hit"} />
				<input type=button id=game_clock_updated_seconds value="game:clock_updated_seconds" disabled={page == "game_clock_updated_seconds"} />
				<input type=button id=game_statfeed_event value="game:statfeed_event" disabled={page == "game_statfeed_event"} />
				<input type=button id=game_goal_scored value="game:goal_scored" disabled={page == "game_goal_scored"} />
				<input type=button id=game_replay_start value="game:replay_start" disabled={page == "game_replay_start"} />
				<input type=button id=game_replay_will_end value="game:replay_will_end" disabled={page == "game_replay_will_end"} />
				<input type=button id=game_replay_end value="game:replay_end" disabled={page == "game_replay_end"} />
				<input type=button id=game_match_ended value="game:match_ended" disabled={page == "game_match_ended"} />
				<input type=button id=game_podium_start value="game:podium_start" disabled={page == "game_podium_start"} />
				<input type=button id=game_match_destroyed value="game:match_destroyed" disabled={page == "game_match_destroyed"} />
			</contents>
		</category>
		<category>
			<p class=title>Features</p>
			<contents>
				<input type=button id=payloads_queue value="Payloads Queue" disabled={page == "payloads_queue"} />
				<!-- <input type=button id=replay_simulator value="Replay Simulator" disabled={page == "replay_simulator"} /> -->
			</contents>
		</category>
		<category>
			<p class=title>Settings</p>
			<contents>
				<input type=button id=websocket_server value="WebSocket Server" disabled={page == "websocket_server"} />
				<input type=button id=match_guid value="Match GUID" disabled={page == "match_guid"} />
				<input type=button id=about_sos_emulator value="About SOS Emulator" disabled={page == "about_sos_emulator"} />
			</contents>
		</category>
	</sidebar>
	<content>
		{#key page}
			<div in:transitionIn out:transitionOut>
				<svelte:component this={pages[page]} {sos} />
			</div>
		{/key}
	</content>
</main>

<style lang="scss">
	main {
		position: absolute;
    top: 0px;
    left: 0px;

    width: 100%;
    height: 100%;

		overflow: hidden;

		z-index: 0;

		-webkit-user-select: none;
		user-select: none;

		sidebar {
			position: absolute;
			top: 0px;
			left: 0px;

			display: flex;
			flex-direction: column;
			z-index: 5;

			overflow-y: scroll;
			overflow-x: hidden;

			width: 260px;
			height: 100%;

			border-right: 1px solid #bbb;
			box-shadow: 0px 0 15px 0px #888;

			category {
				margin-top: 10px;
				margin-bottom: 10px;

				.title {
					width: 100%;
					margin-bottom: 8px;

					color: #666;

					font-size: 1.2em;
					font-weight: 600;
					text-align: center;
				}

				contents {
					display: flex;
					flex-direction: column;

					input {
						width: 100%;
						height: 40px;

						padding-left: 10px;

						cursor: pointer;

						font-size: 1em;
						text-align: left;

						transition: background-color .2s;

						&:hover {
							background-color: #eee;
							transition: background-color .2s;
						}

						&:active, &:disabled {
							background-color: #ccc;
							color: #000;
						}
					}
				}
			}
		}

		content {
			position: absolute;
			top: 0px;
			left: 261px;

			width: 723px;
			height: 576px;

			margin-left: 20px;

			div {
				position: absolute !important;
				top: 0px;
				left: 0px;

				width: 100%;
				padding-right: 20px;
				height: 100%;

				overflow-y: auto;

				z-index: 3;
			}

			:global(.title) {
				width: 100%;
				margin: 10px 0;

				text-align: center;
				font-weight: 600;
				font-size: 2em;
			}

			:global(.description) {
				width: 100%;

				margin-bottom: 10px;

				text-align: center;
				font-size: 17px;
			}

			:global(.separator) {
				height: .25em;
				padding: 0;
				margin: 10px 0;
				background-color: #bbb;
				border: 0;
			}

			:global(input[type=button]) {
				border-radius: 10px;
				padding: 10px;
				margin: 10px 0;

				font-size: 0.8em;

				cursor: pointer;

				background-color: #E1E1E1;
				transition: background-color .2s;

				&:hover {
					background-color: #dadada;
				}

				&:active {
					background-color: #d1d1d1;
				}

				&:nth-child(1n+1){
					display: inline;
				}
			}

			div {
				position: relative;
				width: 100%;
				height: 100%;
				top: 0px;
				left: 0px;
			}
		}
	}
</style>