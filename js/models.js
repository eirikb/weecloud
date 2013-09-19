Server = Backbone.Model.extend({
  urlRoot: 'server',
  socket: window.socket,

  initialize: function() {
    this.set('buffers', new BufferCollection());
    this.on('buffer', this.createBuffer);
  },

  createBuffer: function(data) {
    this.get('buffers').add(new Buffer(data));
  }
});

Buffer = Backbone.Model.extend({});
