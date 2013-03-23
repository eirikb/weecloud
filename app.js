var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var weecloud = require('./lib/weecloud');

server.listen(3000);

app.configure(function() {
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
  res.render('index');
});

io.sockets.on('connection', function(socket) {
  socket.on('connect', function(data, cb) {
    socket.client = weecloud.connect(socket, data, function() {
      cb();
    });
  });
});
