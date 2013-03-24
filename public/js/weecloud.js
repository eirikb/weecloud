$(function() {

  var servers = new ServerCollection();

  function addBuffer(model) {
    var server = servers.get(model.server);
    if (!server) {
      server = new Server({
        title: model.server,
        id: model.server
      });

      servers.add(server);
      var serverView = new ServerView({
        model: server
      });
      $('#bufferlist').append(serverView.render().$el);
    }

    var buffer = new Buffer(model);
    server.get('buffers').add(buffer);
  }

  socket = io.connect();

  socket.on('connect', function() {
    socket.emit('connect', {
      host: 'localhost',
      port: 8000,
      password: 'test'
    }, function(data) {
      socket.emit('init');
    });
  });

  socket.on('open:buffer', function(buffer) {
    addBuffer(buffer);
  });

  socket.on('message', function(message) {
    //console.log(line);
  });
});
