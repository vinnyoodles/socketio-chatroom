var express = require('express');
var router = express.Router();
var socketio = require('socket.io');

var app = express();
var server = app.listen(3000, () => console.log('listening on *:3000'));
var websocket = socketio.listen(server);
app.use(router);

/* GET home page. */
router.get('/', function(req, res) {
  res.send('hello');
});

websocket.on('connection', function(socket) {
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => onMessage(data, socket));

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => addedUser(username, socket));

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => startedTyping(socket));

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => stoppedTyping(socket));
});

function stoppedTyping(socket) {
  socket.broadcast.emit('stop typing', {
    username: socket.username
  });
}

function startedTyping(socket) {
  socket.broadcast.emit('typing', {
    username: socket.username
  });
}

function addedUser(username, socket) {
  // we store the username in the socket session for this client
  socket.username = username;
  socket.emit('login');
  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    username: socket.username
  });
}

function onMessage(message, socket) {
  console.log('Client:', message);
}

// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function(d) {
  websocket.emit('new message', {
    message: d.toString().trim(),
    username: 'vincent'
  });
});