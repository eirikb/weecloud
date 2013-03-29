ServerCollection = Backbone.Collection.extend({
  model: Server
});

BufferCollection = Backbone.Collection.extend({
  model: Buffer,

  initialize: function() {
    this.active = null;
    this.listenTo(this, 'open', this.setActive, this);
  },

  setActive: function(buffer) {
    this.active = buffer;
  }
});

MessageCollection = Backbone.Collection.extend({
  model: Message
});

UserCollection = Backbone.Collection.extend({
  model: User
});
