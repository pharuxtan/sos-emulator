<script lang="ts">
	import Main from "./Components/Main.svelte";
	import FirstLaunch from "./Components/FirstLaunch/FirstLaunch.svelte";
	import Popup from "./Components/Popup.svelte";

	import { fade } from 'svelte/transition';
	import { slideSideOut, slideSideIn } from "./lib/modules/Transitions";
	import type SOS from "./lib/SOS";
	
	export let sos: SOS;

	let base_fl = !sos.settings.first_launch;

	let popup = false;

	sos.popup.toggle = (bool: boolean) => {
		popup = bool
	}

	let first_launch = sos.settings.first_launch;
	sos.updateFirstLaunch = () => {
		sos.settings.first_launch = first_launch = !first_launch
	}
</script>

{#if first_launch}
	<div id=main out:slideSideOut>
		<FirstLaunch {sos} />
	</div>
{:else}
	<div id=main in:slideSideIn={{ base_fl }}>
		<Main {sos} />
	</div>
{/if}

{#if popup}
	<div transition:fade="{{duration: 100}}">
		<Popup popup={sos.popup}/>
	</div>

	<style>
		#main {
			filter: blur(2px);
		}
	</style>
{/if}

<style lang="scss">
	div {
		position: absolute;
    top: 0px;
    left: 0px;

    width: 100%;
    height: 100%;

		z-index: 0;
		transition: filter .1s;
		background-color: #0000;
	}
</style>