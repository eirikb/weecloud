$(function() {

  servers = new ServerCollection();
  buffers = new BufferCollection();
  inputView = new InputView();

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

      var dropdownBufferView = new DropdownBufferView({
        model: server
      });
      $('select').append(dropdownBufferView.render().$el);
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
      console.log('Unknown buffer: ', message.bufferid);
      return;
    }

    buffer.get('messages').add(message);

    var type = message.type;
    var user = message.user;
    var users = buffer.get('users');
    if (type === 'join') users.add(user);
    else if (type === 'part') users.remove(user);
  });

  socket.on('error', function(err) {
    $('#error').text(err).show();
  });

  $('.tip').tooltip();
  $('select').select2({
    width: '100%'
  }).change(function() {
    var val = $(this).val();
    $('[href=#' + val + ']').click();
  });
});
