var connect = require('connect');
var http = require('http');

var app = connect().use(connect.static('dist'));

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var weecloud = require('./lib/weecloud');

io.set('log level', 0);

server.listen(3000);

io.sockets.on('connection', function(socket) {
  socket.on('connect:create', function(model, cb) {
    socket.client = weecloud.connect(socket, model, function(err, version) {
      cb(err, version);
    });
  });
});
