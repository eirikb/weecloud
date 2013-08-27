Server = Backbone.Model.extend({});
Buffer = Backbone.Model.extend({});
ServerCollection = Backbone.Collection.extend({});
BufferCollection = Backbone.Collection.extend({});

BufferNavView = Backbone.Marionette.ItemView.extend({
  template: '#buffer-nav-template'
});

ServerNavView = Backbone.Marionette.CompositeView.extend({
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
