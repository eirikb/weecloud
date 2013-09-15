ServerCollection = Backbone.Collection.extend({
  model: Server,
  url: 'servers',
  socket: window.socket
});

BufferCollection = Backbone.Collection.extend({
  model: Buffer,
  url: 'buffers',
  socket: window.socket
});
