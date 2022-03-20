<script>
  import { open } from "@tauri-apps/api/shell";

  function linkClick(){
    open(this.id);
  }
</script>

<about_sos_emulator>
  <p class=title>About SOS Emulator</p>
  <p class=description>
    SOS Emulator is an application to help testing Rocket League Overlay made with <span id="https://gitlab.com/bakkesplugins/sos" on:click={linkClick}>SOS</span><br>
    You can view the source of the software here: <span id="https://github.com/pharuxtan/sos-emulator" on:click={linkClick}>https://github.com/pharuxtan/sos-emulator</span><br>
    Idea is originally from SilentEcho (<span id="https://github.com/SilentEchoUK/sos-packages/tree/main/emulator-electron" on:click={linkClick}>his version here</span>), and wanted to do my own
  </p>
</about_sos_emulator>

<style lang="scss">
  about_sos_emulator {
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
      text-align: center;

      font-weight: normal;
      font-size: 1.2em;
      line-height: 1.4em;

      span {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  } 
</style>