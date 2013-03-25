$(function() {

  var servers = new ServerCollection();

  function addBuffer(buffer) {
    var server = servers.get(buffer.server);
    if (!server) {
      server = new Server({
        title: buffer.server,
        id: buffer.server
      });

      servers.add(server);
      var serverView = new ServerView({
        model: server
      });
      $('#bufferlist').append(serverView.render().$el);
    }

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
