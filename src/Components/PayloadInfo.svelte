<script lang="ts">
  import HighlightPayloadJSON from "../lib/modules/HighlightPayloadJSON";
  export let info;
</script>

<background>
  <payload_info>
    <p class=name>{info.item.name}</p>
    <p class=index>{info.item.name != "Timer" ? "Payload" : "Timer"} is at index {info.index}</p>
    {#if info.item.payload}
      <pre>{@html HighlightPayloadJSON(info.item.payload)}</pre>
    {/if}
    <div class=button><input type=button value="Quit" on:click={info.toggle(false)}></div>
  </payload_info>
</background>

<style lang="scss">
  background {
    position: fixed;
    top: 0px;
    left: 0px;

    z-index: 999;

    width: 100%;
    height: 100%;

    background-color: #00000020;

    payload_info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      min-width: 300px;
      max-width: 900px;
      max-height: 480px;

      overflow-x: auto;

      display: flex;
      flex-direction: column;

      border-radius: 15px;
      padding: 20px 25px;
      
      background-color: #FFFFFF;
      box-shadow: 0 3px 2px -2px gray;

      pre {
        width: max-content;
        overflow-y: auto;
        margin-bottom: 0px;
      }

      .name {
        width: max-content;
        margin-top: 5px;
        font-weight: bold;
        font-size: 20px;
      }

      .index {
        margin-top: 10px;

        width: 100%;
        font-size: 16px;
      }

      .button {
        margin-top: 10px;
        
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        input {
          padding: 10px 30px;
          border-radius: 50px;

          margin-left: 15px;
          
          cursor: pointer;

          font-size: 1em;
          
          transition: background-color .1s;
          background-color: #E1E1E1;

          &:hover {
            background-color: #dadada;
          }

          &:active {
            background-color: #d1d1d1;
          }

          box-shadow: rgb(255 255 255 / 0%) 0 0 0 3px, rgb(0 102 255 / 0%) 0 0 0 4px;
        }
      }
    }
  }
</style>