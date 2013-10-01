Buffer = Backbone.Model.extend({
  defaults: {
    notifications: ''
  },

  urlRoot: 'buffer',
  socket: window.socket,

  initialize: function() {
    this.ioBind('destroyBuffer', this.destroy);
    if (this.get('notifications') === 0) {
      this.set('notifications', '');
    }
  }
});

Server = Backbone.Model.extend({
  initialize: function() {
    this.set('buffers', new ServerBufferCollection());
  }
});
