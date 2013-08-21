$(function() {
  $('.tip').tooltip();
  socket = io.connect();

  App = new Backbone.Marionette.Application();

  App.addRegions({
    nav: '#nav'
  });

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

  var nav = new Nav({
    collection: new ServerCollection()
  });

  socket.on('open:buffer', function(buffer) {
    var server = nav.collection.get(buffer.server);
    if (!server) {
      server = new Server({
        id: buffer.server,
        title: buffer.server,
        buffers: new BufferCollection()
      });
      nav.collection.add(server);
    }
    var b = new Buffer(buffer);
    server.get('buffers').add(b);
  });

  socket.on('error', function(err) {
    $('#error').text(err).show();
  });
});
