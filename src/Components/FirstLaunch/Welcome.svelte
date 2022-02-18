<script type="ts">
	import { fly } from 'svelte/transition';
  export let state;

  let animate: boolean = false;

  setTimeout(() => {
    animate = true;
  }, 10);

  function changeState(){
    state = "websocket";
  }
</script>

<welcome>
  {#if animate}
    <div in:fly="{{duration: 800, y: 30, opacity: 0}}">
      <p class=title>Welcome to SOS Emulator!</p>
    </div>
  {/if}
  {#if animate}
    <div in:fly="{{delay: 150, duration: 800, y: 30, opacity: 0}}">
      <p class=description>
        Tired of making bot private match on Rocket League for your tests?<br>
        This tool will emulate sos websocket to make tests easier
      </p>
    </div>
  {/if}
  {#if animate}
    <div in:fly="{{delay: 300, duration: 800, y: 30, opacity: 0}}">
      <getstarted on:click={changeState}>
        <p>Get Started</p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53">
          <path d="M51.4 22.7 34.4 1.45A1 1 0 0029.4 5.45L43.9 22.7 3.9 22.7A1 1 0 003.9 30.2L43.9 30.2 29.4 47.45A1 1 0 0034.4 51.45L51.4 29.95Q54.1 26.325 51.4 22.7Z"/>
        </svg>
      </getstarted>
    </div>
  {/if}
</welcome>

<style lang="scss">
  welcome {
    position: absolute;
    top: 170px;
    left: 207px;

    z-index: 1;

    width: 610px;
    height: 180px;

    -webkit-user-select: none;
    user-select: none;
    
    cursor: default;

    .title {
      position: absolute;
      top: 0px;
      left: 0px;

      width: 610px;
      text-align: center;

      font-weight: 800;
      font-size: 2.5em;
    }

    .description {
      position: absolute;
      top: 60px;
      left: 0px;

      width: 610px;
      text-align: center;

      font-weight: normal;
      font-size: 1.2em;
    }

    getstarted {
      position: absolute;
      top: 115px;
      left: 223px;

      width: 160px;
      height: 50px;

      margin-top: 10px;

      display: flex;
      justify-content: space-between;
      align-items: center;

      border: 2px solid #888;
      border-radius: 15px;

      transition: border .1s;

      &:hover {
        border: 2px solid #444;
      }

      &:active {
        border: 2px solid #000;
      }

      cursor: pointer;

      p {
        margin-left: 10px;

        font-weight: normal;
        font-size: 1.1em;
        user-select: none;
      }

      svg {
        margin-right: 10px;
        
        width: 30px;
        height: 30px;

        background-color: #00000000;
      }
    }
  }
</style>