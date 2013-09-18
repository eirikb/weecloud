ServerCollection = Backbone.Collection.extend({
  model: Server,
  url: 'servers',
  socket: window.socket,

  initialize: function() {
    this.ioBind('create', this.serverCreate, this);
  },

  serverCreate: function(data) {
    this.add(new Server(data));
  }
});

BufferCollection = Backbone.Collection.extend({
  model: Buffer,
  url: 'buffers',
  socket: window.socket
});
