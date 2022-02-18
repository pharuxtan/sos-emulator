interface action {
  name: string,
  callback?: Function
}

class Popup {
  toggle: Function;

  title: string = "";
  description: string = "";
  actions: action[] = [];

  showPopup(title: string, description: string, actions: action[]){
    this.title = title;
    this.description = description;
    for(let action of actions){
      let callback: Function | undefined = action.callback;
      action.callback = () => {
        this.toggle(false);
        setTimeout(() => {
          if(callback) callback();
        }, 120);
      }
    }
    this.actions = actions;
    this.toggle(true);
  }
}

export default Popup;