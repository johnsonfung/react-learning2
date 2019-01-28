const COLOURS = {
  trace: '#aaa',
  info: 'blue',
  warn: 'pink',
  error: 'red',
  userAction: 'green',
  addToProfile: 'orange'
}; // choose better colours :)

class Log {
  generateMessage(level, message, source, group) {
    // Set the prefix which will cause debug to enable the message
    /* const namespace = `${BASE}:${level}`;
    const createDebug = debug(namespace);
    
    // Set the colour of the message based on the level
    createDebug.color = COLOURS[level];
    
    if(source) { createDebug(source, message); }
    else { createDebug(message); }
    */

    var textColor = COLOURS[level];

    if(!group){
      if(typeof message === "object"){
        console.dir(message)
      } else {
        console.log("%c"+source+"  ||  %c"+message, "color:#000;", "color:"+textColor+";")
      }
      
    } else if(group === "start") {
      console.group("%c"+source+"  ||  %c"+message, "color:#000;", "color:"+textColor+";")
    } else if(group === "end"){
      console.groupEnd();
    }

  }
  
  trace(message, source, group) {
    return this.generateMessage('trace', message, source, group);
  }
  
  info(message, source, group) {
    return this.generateMessage('info', message, source, group);
  }
  
  warn(message, source, group) {
    return this.generateMessage('warn', message, source, group);
  }
  
  error(message, source, group) {
    return this.generateMessage('error', message, source, group);
  }

  userAction(message, source, group) {
    return this.generateMessage('userAction', message, source, group);
  }

  addToProfile(message, source, group) {
    return this.generateMessage('addToProfile', message, source, group);
  }
}

export default new Log();