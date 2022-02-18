import SOS from "./lib/SOS";

let sos = new SOS();

// @ts-ignore
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: { sos },
	intro: true
});

export default app;