BufferNavView = Backbone.Marionette.ItemView.extend({
  tagName: 'li',
  template: '#buffer-nav-template',
  initialize: function() {
    this.model.on('change', this.render);
  }
});

ServerNavView = Backbone.Marionette.CompositeView.extend({
  tagName: 'li',
  itemView: BufferNavView,
  itemViewContainer: 'ul',
  template: '#server-nav-template',
  initialize: function() {
    this.collection = this.model.get('buffers');
  }
});

Nav = Backbone.Marionette.CollectionView.extend({
  el: '#nav',
  itemView: ServerNavView
});
