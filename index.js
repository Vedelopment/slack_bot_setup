if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
///////////////////////////////////////////////
/////            Sever Config             /////
///////////////////////////////////////////////

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const http = require('http')
const port = process.env.PORT || 3000

///////////////////////////////////////////////
/////            Slack Config             /////
///////////////////////////////////////////////

const { WebClient } = require('@slack/client');
const { RTMClient } = require('@slack/client');
const { IncomingWebhook } = require('@slack/client');
const { createEventAdapter } = require('@slack/events-api');
const { createMessageAdapter } = require('@slack/interactive-messages');

const slackToken = process.env.SLACK_TOKEN
const slackWeb = new WebClient(slackToken);
const slackRtm = new RTMClient(slackToken);
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

// To setup slack webhooks, uncomment this line and create a slack webhook url here: https://api.slack.com/incoming-webhooks
// const slackWebhook = new IncomingWebhook(<Slack Webhook Url>);

///////////////////////////////////////////////
/////             Sever Start             /////
///////////////////////////////////////////////

// Starting Express Server
// app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static('public'));
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});


// Only run the real time server if it's activated
if (process.env.START_SLACK_RTM === 'true') slackRtm.start()

///////////////////////////////////////////////
/////                Web UI               /////
///////////////////////////////////////////////

app.get('/', function(req, res){
  console.log(__dirname);
  res.sendFile('index.html', {
    root : __dirname
  });
});

///////////////////////////////////////////////
/////         Incoming Webhooks           /////
///////////////////////////////////////////////

app.post('/slack/events', (req, res)=>{
  console.log(req.payload, req.body, req.challenge, req.token)
  res.send(req.body)
})



///////////////////////////////////////////////
/////            Slack Events             /////
///////////////////////////////////////////////
