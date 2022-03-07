<script lang="ts">
  export let popup;
</script>

<background>
  <popup>
    <p class=title>{popup.title}</p>
    <p class=description>{popup.description}</p>
    <actions>
      {#each popup.actions as action, i}
        <input type=button class="action {i == popup.actions.length-1 ? "main" : ""}" value={action.name} on:click={action.callback}>
      {/each}
    </actions>
  </popup>
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

    popup {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;

      border-radius: 15px;
      padding: 20px 25px;
      
      background-color: #FFFFFF;
      box-shadow: 0 3px 2px -2px gray;

      .title {
        width: max-content;
        margin-top: 10px;
        font-weight: bold;
        font-size: 20px;
      }

      .description {
        margin-top: 15px;

        width: 100%;
        font-size: 20px;
      }

      actions {
        margin-top: 15px;
        
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
          
          &.main {
            color: #FFFFFF;
            background-color: #06f;

            &:hover {
              background-color: rgb(0, 94, 235);
            }

            &:active {
              background-color: rgb(0, 87, 218);
            }
          }
        }
      }
    }
  }
</style>