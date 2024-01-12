// index.js
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const Events = require('./events');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static('public'));


const eventManager = new Events();

function cbFunction (eventName){
  console.log(eventName+' callback is called');
    
}


app.post('/onEvent',(req,res)=>{
  const {eventName} = req.body;
  const newCbFunction = () => {
    return cbFunction(eventName)
  }
  eventManager.on(eventName,newCbFunction);
  res.sendStatus(201);
  
})
app.post('/triggerCallbacks',(req,res)=>{

  const {eventName} = req.body;
  eventManager.trigger(eventName);
  res.sendStatus(201);
})
app.post('/offEvents',(req,res)=>{
  const {eventName} = req.body;
  eventManager.off(eventName);
  res.sendStatus(201);
})


// Example usage of eventManager
// You can add more event handlers here as per your application's logic

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
