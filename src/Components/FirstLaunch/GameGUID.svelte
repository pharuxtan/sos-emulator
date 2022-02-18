<script type="ts">
  import type SOS from "src/lib/SOS";

  export let sos: SOS;

  let guid = sos.settings.match_guid;
  
  function generate(){
    guid = sos.guid();
  }

  function enter() {
    sos.settings.match_guid = guid;
    localStorage.setItem("first_launch", "false");
    localStorage.setItem("socket_port", sos.settings.socket_port);
    localStorage.setItem("match_guid", guid);
    sos.updateFirstLaunch();
  }
</script>

<gameguid>
  <p class=title>Define a match GUID</p>
  <p class=description>
    When you create a match, Rocket League generate a random 32 hex digit guid.<br>
    Match GUID is sended on all SOS Packets, so you are free to edit it as you want.<br>
    Can be useful if you want to know if the packet is from SOS Emulator or not
  </p>
  <p class=guid>Match GUID: <input type=text bind:value={guid} on:keyup={(e) => {if(e.key == "Enter") enter()}} /></p>
  <buttons>
    <generate class=button on:click={generate}>
      <p>Generate new one</p>
    </generate>
    <enter class=button on:click={enter}>
      <p>Enter emulator</p>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53">
        <path d="M51.4 22.7 34.4 1.45A1 1 0 0029.4 5.45L43.9 22.7 3.9 22.7A1 1 0 003.9 30.2L43.9 30.2 29.4 47.45A1 1 0 0034.4 51.45L51.4 29.95Q54.1 26.325 51.4 22.7Z"/>
      </svg>
    </enter>
  </buttons>
</gameguid>

<style lang="scss">
  gameguid {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    -webkit-user-select: none;
    user-select: none;

    .title {
      margin-top: -50px;
      text-align: center;

      font-weight: 800;
      font-size: 2.5em;
    }

    .description {
      margin-top: 10px;

      text-align: center;

      font-weight: normal;
      font-size: 1.2em;
    }

    .guid {
      margin-top: 10px;

      text-align: center;

      font-weight: normal;
      font-size: 1.2em;

      input {
        display: inline;

        width: 445px;
        padding: 5px 15px;
        border-radius: 10px;

        background-color: #E1E1E1;

        font-weight: normal;
        font-size: 1em;
      }
    }

    buttons {
      position: relative;
      margin: 15px auto;
      
      display: flex;
      flex-direction: row;
      align-items: center;

      .button {
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
      }

      generate {
        height: 50px;
        padding-right: 10px;
        margin-right: 20px;
      }

      enter {
        width: 182px;
        height: 50px;

        svg {
          margin-right: 10px;
          
          width: 30px;
          height: 30px;

          background-color: #00000000;
        }
      }
    }
  }
</style>