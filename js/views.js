BufferNavView = Backbone.Marionette.ItemView.extend({
  template: '#buffer-nav-template'
});

ServerNavView = Backbone.Marionette.CompositeView.extend({
  itemView: BufferNavView,
  itemViewContainer: 'ul',
  template: '#server-nav-template',
  initialize: function() {
    this.collection = this.model.get('buffers');
    this.collection.fetch();
  }
});

Nav = Backbone.Marionette.CollectionView.extend({
  el: '#nav',
  itemView: ServerNavView
});
