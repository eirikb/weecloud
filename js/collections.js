BufferCollection = Backbone.Collection.extend({
  model: Buffer,
  url: 'buffers',
  socket: window.socket,

  initialize: function() {
    this.ioBind('createBuffer', this.add, this);
  },

  add: function(buffer) {
    buffer = new Buffer(buffer);
    var serverId = buffer.get('server');
    var server = servers.getOrCreate(serverId);
    server.get('buffers').add(buffer);
  }
});

ServerBufferCollection = Backbone.Collection.extend({
  model: Buffer
});

ServerCollection = Backbone.Collection.extend({
  model: Server,

  getOrCreate: function(id) {
    var server = this.get(id);
    if (!server) {
      server = new Server({
        id: id
      });
      this.add(server);
    }
    return server;
  }
});
