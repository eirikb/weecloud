Server = Backbone.Model.extend({
  initialize: function() {
    this.set('buffers', new BufferCollection());
  }
});

Buffer = Backbone.Model.extend({});
