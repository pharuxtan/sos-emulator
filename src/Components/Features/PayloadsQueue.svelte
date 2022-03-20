<script lang="ts">
  import type SOS from "../../lib/SOS";
  import * as dialog from "@tauri-apps/api/dialog";

  export let sos: SOS;

  let queue = sos.payloads.payloads_queue;

  for(let item of queue){
    if(item.executed) item.executed = false;
  }

  let i = -1,
        timeout = null,
        cancelSleep = null;

  // Drag & Drop

  let hovering: any = null;
  let scrollInterval = undefined;

  function drop(event, target){
    if(scrollInterval) clearInterval(scrollInterval);
    event.dataTransfer.dropEffect = 'move'; 
    let start = parseInt(event.dataTransfer.getData("text/plain"));
    let newQueue = queue;

    if (start < target) {
      newQueue.splice(target + 1, 0, newQueue[start]);
      newQueue.splice(start, 1);
    } else {
      newQueue.splice(target, 0, newQueue[start]);
      newQueue.splice(start + 1, 1);
    }
    if(Number(start) == i) i = Number(event.target.id);
    queue = sos.payloads.payloads_queue = newQueue;
    sos.payloads.saveQueue();
  }

  function dragstart(event, i){
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/plain', i);
  }

  let listElem;

  function mouseMove(event){
    if(scrollInterval) clearInterval(scrollInterval);
    if(event.y < 60){
      scrollInterval = setInterval(() => {
        if(hovering == null) clearInterval(scrollInterval);
        if(listElem) listElem.scrollBy(0, -1);
      }, 1)
    } else if(event.y > 514){
      scrollInterval = setInterval(() => {
        if(hovering == null) clearInterval(scrollInterval);
        if(listElem) listElem.scrollBy(0, 1);
      }, 1)
    }
  }

  // Delete

  function onDelete(event){
    let index = Number(event.target.parentElement.id);
    if(index == i && timeout){
      clearTimeout(timeout);
      cancelSleep();
    }
    queue.splice(index, 1);
    queue = sos.payloads.payloads_queue = queue;
    sos.payloads.saveQueue();
  }

  function clearQueue(){
    queue.splice(0, queue.length);
    queue = sos.payloads.payloads_queue = queue;
    sos.payloads.saveQueue();
  }

  // Info

  function onInfo(event){
    let index = Number(event.target.parentElement.id);
    let item = queue[index];
    sos.payloads.payload_info.index = index;
    sos.payloads.payload_info.item = item;
    sos.payloads.payload_info.toggle(true);
  }

  // Breakpoint & Startpoint

  function onBreakpoint(event){
    let index = Number(event.target.parentElement.id);
    let item = queue[index];
    item.breakpoint = !item.breakpoint;
    queue = sos.payloads.payloads_queue = queue;
    sos.payloads.saveQueue();
  }

  function onStartpoint(event){
    let index = Number(event.target.parentElement.id);
    let item = queue[index];
    let previousItem = queue.find(item => item.startpoint);
    if(previousItem && previousItem != item) previousItem.startpoint = false;
    item.startpoint = !item.startpoint;
    queue = sos.payloads.payloads_queue = queue;
    sos.payloads.saveQueue();
  }

  // Add time

  function addTime(){
    queue.push({
      name: "Timer",
      time: 0,
      startpoint: false,
      breakpoint: false,
      executed: false
    });
    queue = sos.payloads.payloads_queue = queue;
    sos.payloads.saveQueue();
  }

  function updateTime(event, timer){
    if(event.target.value == "") timer.time = 0;
    timer.time = Number(event.target.value);
    sos.payloads.saveQueue();
  }

  // Duplicate

  function onDuplicate(event){
    if(!event.shiftKey || event.target.id == "") return;
    let index = Number(event.target.id);
    queue.splice(index+1, 0, {...queue[index]});
    queue = sos.payloads.payloads_queue = queue;
    sos.payloads.saveQueue();
  }

  // Record from Rocket League

  async function recordRL(){
    await sos.payloads.record_rl(true);
    queue = sos.payloads.payloads_queue;
    sos.payloads.saveQueue();
  }

  // Import and Export

  async function importQueue(){
    let path = await dialog.open({
      title: "Open a queue",
      filters: [{ name: "SOS Emulator Queue", extensions: ["json"] }],
      multiple: false,
      directory: false
    });
    if(!path) return;
    try {
      let q = await sos.payloads.importJson(path);
      if(queue.length == 0){
        queue = sos.payloads.payloads_queue = q;
        return sos.payloads.saveQueue();
      }
      sos.popup.showPopup("Are you sure you want to overwrite current queue ?", "Current queue will be overwritten by the imported file, are you sure you want to continue ?", [
        { name: "Cancel" },
        { name: "Yes", callback: () => {
          queue = sos.payloads.payloads_queue = q;
          sos.payloads.saveQueue();
        }}
      ]);
    } catch(e){
      sos.popup.showPopup("The json you trying to import is invalid", "Error: "+e.message, [{ name: "Ok" }])
    }
  }

  async function exportQueue(){
    let path = await dialog.save({
      title: "Save the queue",
      filters: [{ name: "SOS Emulator Queue", extensions: ["json"] }]
    });
    if(!path) return;
    try {
      await sos.payloads.exportJson(path);
    } catch(e){
      sos.popup.showPopup("An error as occured while exporting", "Error: "+e.message,  [{ name: "Ok" }]);
    }
  }

  /* Queue started */

  let started = false,
        paused = false;

  async function startQueue(){
    started = true;
    let start = queue.find(item => item.startpoint);
    i = start ? queue.indexOf(start) : 0;
    let didBreakout = false;
    while(true){
      let item = queue[i];
      if(!item || !started) break;
      if(!paused){
        item.executed = true;
        queue = queue;
        if(item.breakpoint && !didBreakout){
          didBreakout = true;
          paused = true;
          let elem = [...document.querySelectorAll("div.item")].find(d => d.id == i.toString());
          if(listElem) listElem.scroll(0, elem["offsetTop"]);
          continue;
        }
        didBreakout = false;
        if(item.name == "Timer"){
          await sleep(item.time);
          timeout = undefined;
        } else {
          sos.ws.send(JSON.stringify(item.payload));
        }
        item.executed = false;
        i++;
      } else {
        await sleep(100); // Used to not freeze the thread while paused
      }
    }
    started = false;
    i = -1;
    queue = queue;
  }

  function pauseQueue(){
    paused = !paused;
  }

  function stopQueue(){
    started = false;
    paused = false;
    if(timeout){
      clearTimeout(timeout);
      cancelSleep();
    }
    for(let item of queue){
      if(item.executed) item.executed = false;
    }
  }

  function sleep(ms){
    return new Promise((r) => {
      cancelSleep = r;
      timeout = setTimeout(r, ms);
    });
  }
</script>

<payloads_queue>
  <div class=list bind:this={listElem}>
    {#each queue as item, index}
      <div class=item id={index.toString()}
            draggable=true
            on:dragstart={event => dragstart(event, index)}
            on:drop|preventDefault={event => drop(event, index)}
            on:dragover|preventDefault={() => false}
            on:dragenter={() => hovering = index}
            on:dragend={() => hovering = null}
            on:drag={mouseMove}
            on:click={onDuplicate}
            class:active={hovering === index}
            class:executed={item.executed}>
            {#if item.name == "Timer"}
              Wait <input class=time type="text" on:beforeinput={sos.filter.number} on:input={(event) => { updateTime(event, item) }} value={item.time}/> ms
            {:else}
              {item.name}
            {/if}
            <svg on:click={onInfo} class=info xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="18.5" fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="3"/>
              <circle cx="24" cy="16" r="2"/>
              <line x1="24" x2="24" y1="22.5" y2="33.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3"/>
            </svg>
            <svg on:click={onDelete} class=close viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M562.27 511.274l305.892-305.888c1.935-1.937 1.935-5.809 0-9.68l-44.532-42.592c-1.936-1.937-3.868-1.937-3.868-1.937-1.94 0-1.94 0-3.872 1.937L510 459.002l-305.887-306.13c-1.939-1.936-3.873-1.936-3.873-1.936-1.939 0-1.939 0-3.872 1.936l-44.528 44.77c-1.939 1.935-1.939 5.808 0 9.68L457.728 513.21 151.84 816.92c-1.939 1.936-1.939 5.808 0 9.68l42.592 44.527c1.936 1.939 3.869 1.939 3.869 1.939s1.939 0 3.873-1.939L510 563.545l305.889 305.89c1.936 1.936 3.872 1.936 3.872 1.936s1.935 0 3.868-1.936l42.592-44.532c1.94-1.935 1.94-5.807 0-9.68L562.27 511.274z"/>
            </svg>
            <svg on:click={onBreakpoint} class=breakpoint class:break={item.breakpoint} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15a1 1 0 0010 0 1 1 0 00-10 0z"/>
            </svg>
            <svg on:click={onStartpoint} class=startpoint class:start={item.startpoint} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 7l10 8-10 8z"/>
            </svg>
        </div>
    {/each}
  </div>
  <div class=config>
    {#if started}
      <p>Position: {i}</p>
      <input type="button" on:click={pauseQueue} value={paused ? "Continue" : "Pause"}/>
      <input type="button" on:click={stopQueue} value="Stop"/>
      <input type="button" on:click={addTime} value="Add a timer"/>
    {:else}
      <input type="button" on:click={clearQueue} value="Clear the queue"/>
      <input type="button" on:click={addTime} value="Add a timer"/>
      <input type="button" on:click={startQueue} value="Start"/>
      <input type="button" on:click={recordRL} value="Record from Rocket League"/>
      <div class=imexport>
        <input type="button" on:click={exportQueue} value="Export"/>
        <input type="button" on:click={importQueue} value="Import"/>
      </div>
      {/if}
  </div>
</payloads_queue>

<style lang="scss">
  payloads_queue {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    -webkit-user-select: none;
    user-select: none;

    .list {
      width: 460px;
      height: 534px;
      overflow-y: auto;

      border: 2px solid #000;
      border-radius: 6px;
      scroll-behavior: smooth;

      .item {
        position: relative;
        padding: 15px 10px;
        
        font-size: 1.2em;
        transition: background-color .2s;

        svg * {
          pointer-events: none;
        }

        input.time {
          display: inline;

          width: 150px;
          padding: 5px 15px;
          border-radius: 10px;

          transition: background-color .2s;
          background-color: #e1e1e1;

          font-weight: normal;
          font-size: 0.8em;
        }

        &:hover {
          background-color: #e1e1e1;

          svg { background-color: #e1e1e1; }
          input.time { background-color: #d1d1d1; }
        }

        &.executed {
          background-color: #d1d1d1;

          svg { background-color: #d1d1d1; }
          input.time { background-color: #c1c1c1; }
        }

        &.active {
          background-color: #3273dc;

          svg { background-color: #3273dc; }
        }

        svg {
          position: absolute;
          transform: translate(0, -50%);

          top: 50%;
          width: 30px;
          height: 30px;
          border-radius: 4px;

          cursor: pointer;
          transition: background-color .2s;
        }

        .close {
          right: 10px;

          &:hover {
            background-color: #e32636;
          }

          &:active {
            background-color: #a91d28;
          }
        }

        .info {
          right: 50px;

          &:hover {
            background-color: #1e88e5;
          }

          &:active {
            background-color: #1a73c1;
          }
        }

        .breakpoint {
          right: 90px;

          &:hover {
            background-color: #c1c1c1;
          }

          &:active {
            background-color: #b1b1b1;
          }

          fill: #000;
          transition: fill .1s, background-color .2s;
          &.break {
            fill: #e32636;
          }
        }

        .startpoint {
          right: 130px;

          &:hover {
            background-color: #c1c1c1;
          }

          &:active {
            background-color: #b1b1b1;
          }

          fill: #000;
          transition: fill .1s, background-color .2s;
          &.start {
            fill: #26e326;
          }
        }
      }
    }

    .config {
      width: 240px;
      height: 534px;

      input[type=button]{
        width: 100%;
        margin: 0 0;
        margin-bottom: 10px;
      }

      .imexport {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        input:nth-child(1){
          margin-right: 10px;
        }
      }

      p {
        width: 100%;
        margin-bottom: 10px;
        cursor: default;

        text-align: center;
      }
    }
  }
</style>