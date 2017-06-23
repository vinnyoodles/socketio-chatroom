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
  socket.on('new message', (message) => console.log('Client:', message));
});

// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function(d) {
  websocket.emit('new message', {
    message: d.toString().trim(),
    username: 'vincent'
  });
});