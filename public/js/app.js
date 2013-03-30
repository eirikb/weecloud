$(function() {

  servers = new ServerCollection();
  buffers = new BufferCollection();

  new InputView();

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
      $('#bufferlist ul').append(serverView.render().$el);
    }

    buffer = new Buffer(buffer);
    server.get('buffers').add(buffer);
    buffers.add(buffer);

    if ($('#bufferlist .active').length > 0) return;
    $('#bufferlist a').tab('show');
  }

  socket = io.connect();

  socket.on('open:buffer', function(buffer) {
    addBuffer(buffer);
  });

  socket.on('message', function(message) {
    var buffer = buffers.get(message.bufferid);
    if (!buffer) {
      console.log('Unkown buffer: ', message.bufferid);
      return;
    }

    buffer.get('messages').add(message);
  });

  socket.on('join', function(message, user) {
    var buffer = buffers.get(message.bufferid);
    if (!buffer) {
      console.log('Unkown buffer: ', message.bufferid);
      return;
    }

    buffer.get('users').add({
      title: user,
      id: user
    });
    buffer.get('messages').add(message);
  });

  socket.on('part', function(message, user) {
    var buffer = buffers.get(message.bufferid);
    if (!buffer) {
      console.log('Unkown buffer: ', message.bufferid);
      return;
    }

    buffer.get('users').remove(user);
    buffer.get('messages').add(message);
  });

  $('.tip').tooltip();
});
