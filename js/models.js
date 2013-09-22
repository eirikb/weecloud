Buffer = Backbone.Model.extend({
  urlRoot: 'buffer',
  socket: window.socket,

  initialize: function() {
    this.ioBind('destroyBuffer', this.destroy);
  }
});

Server = Backbone.Model.extend({
  initialize: function() {
    this.set('buffers', new ServerBufferCollection());
  }
});
