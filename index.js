const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const irc = require('irc');
const db = require('./db');
const { broadcast } = require('./utils');

const client = new irc.Client('irc.hackint.org', 'Webuser69Wink', {
  channels: ['#gpn'],
  secure: true,
  port: 6697
});

client.addListener('message', (from, to, text) => {
  const message = {
    date: new Date(),
    text,
    from
  };

  db.get('messages')
    .push(message)
    .write();

  broadcast(expressWs, message);
});

client.addListener('error', error => console.error(error));

app.get('/messages', (req, res) => {
  const messages = db
    .get('messages')
    .drop(parseInt(req.query.offset) || 0)
    .take(parseInt(req.query.limit) || 100);

  if (messages) {
    res.json(messages);
  } else {
    res.status(404).json({
      error: 'No messages matched your query.'
    });
  }
});

app.get('/info', (req, res) => {
  console.log(client);
  res.send('OK');
});

app.use(express.static('public'));
app.listen(8080);
