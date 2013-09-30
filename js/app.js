App = new Backbone.Marionette.Application();

App.addRegions({
  nav: '#nav',
  chat: '#chat'
});

socket = io.connect();

socket.on('connected', function() {});

$(function() {
  $('.tip').tooltip();
});

var servers = new ServerCollection();
var buffers = new BufferCollection();
var nav = new Nav({
  collection: servers
});

App.init = function() {
  socket.emit('init');
  $('#chat').removeClass('hide');
  $('#connect').addClass('hide');
};
