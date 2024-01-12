
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://PawanSingh:Pawan9305@cluster0.pr3ptou.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'Eventsapp';
let db;

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  db = client.db(dbName);
});

class Events {
  constructor() {
    this.handlers = {};
  }

  on(eventName, callback) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(callback);
    console.log(eventName+' - on');
  }

  trigger(eventName) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach(callback => {
        callback();
        this.logEvent(eventName);
      });
    }
  }

  off(eventName) {
    if (this.handlers[eventName]){
      delete this.handlers[eventName];
      this.logEvent(eventName + " - off");
      console.log(eventName+ " - off");
    }else{
      console.log(eventName+ " Event is not On right now");
    }
  }

  logEvent(eventName) {
    const eventLog = {
      event: eventName,
      triggerTime: new Date()
    };
    db.collection("eventLogs").insertOne(eventLog, function(err, res) {
      if (err) throw err;
      console.log("Event inserted in Mongodb");
    });

    const logMessage = `event --> ${eventName}, timestamp --> ${new Date().toISOString()}\n`;
    fs.appendFile('app.log', logMessage, function (err) {
      if (err) throw err;
      console.log(eventName+' inserted in the app.log!');
    });
  }
}



module.exports = Events;
