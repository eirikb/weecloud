var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var weecloud = require('./lib/weecloud');

var package = require('./package.json');
package.options = package.options || {};

io.set('log level', 0);

server.listen(process.env.PORT || 3000);

app.configure(function() {
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
  res.render('index', package);
});

io.sockets.on('connection', function(socket) {
  socket.on('connect', function(data, cb) {
    socket.client = weecloud.connect(socket, data, function(version) {
      cb(version);
    });
  });
});
