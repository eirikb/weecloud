ServerCollection = Backbone.Collection.extend({
  model: Server,
  url: 'servers',
  socket: window.socket,

  initialize: function() {
    this.ioBind('create', this.serverCreate, this);
    this.ioBind('createBuffer', this.bufferCreate, this);
  },

  serverCreate: function(data) {
    this.add(new Server(data));
  },

  bufferCreate: function(data) {
    var server = this.find(function(server) {
      return server.get('title') === data.server;
    });

    if (!server) return;

    server.trigger('buffer', data);
  }

});

BufferCollection = Backbone.Collection.extend({
  model: Buffer,
  url: 'buffers',
  socket: window.socket
});
