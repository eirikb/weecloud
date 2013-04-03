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
    console.log('wat', buffer);
    addBuffer(buffer);
  });

  socket.on('message', function(message) {
    var buffer = buffers.get(message.bufferid);
    if (!buffer) {
      console.log('Unkown buffer: ', message.bufferid);
      return;
    }

    buffer.get('messages').add(message);

    var type = message.type;
    var user = message.user;
    var users = buffer.get('users');
    if (type === 'join') users.add(user);
    else if (type === 'part') users.remove(user);
  });

  $('.tip').tooltip();
});
