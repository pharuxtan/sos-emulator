class Filter {
  input(regex: RegExp, filter?: Function){
    return function(event){
      if(!event.data) return;
      let data = event.data.replace(regex, "");
      if(data == '') return event.returnValue = false;
  
      this.filterStart = this.selectionStart;
      this.filterEnd = this.selectionEnd;
  
      let createValue = () => [this.value.substring(0, this.filterStart), data, this.value.substring(this.filterEnd, this.value.length)].join('');
      
      if(filter) data = filter(this, data, createValue, event);
      if(data == '') return event.returnValue = false;
  
      event.returnValue = false;
      this.value = createValue();
  
      this.setSelectionRange(this.filterStart+data.length, this.filterStart+data.length);
      this.dispatchEvent(new Event("input"));
    };
  }

  number = this.input(/[^0-9]/g);

  float = this.input(/[^0-9\.]/g, (element, data) => {
    if(element.value.indexOf(".") != -1)
      data = data.replace(/\./g, "");
    return data;
  });

  coordinate = this.input(/[^0-9\.-]/g, (element, data, createValue) => {
    if(element.value.indexOf(".") != -1)
      data = data.replace(/\./g, "");
    let value = createValue();
    if(element.value.indexOf("-") != -1 || (value.indexOf("-") != -1 && !value.startsWith("-")))
      data = data.replace(/\-/g, "");
    return data;
  });

  minus = this.input(/[^0-9-]/g, (element, data, createValue) => {
    let value = createValue();
    if(element.value.indexOf("-") != -1 || (value.indexOf("-") != -1 && !value.startsWith("-")))
      data = data.replace(/\-/g, "");
    return data;
  });
}

export default Filter;
