App = new Backbone.Marionette.Application();

App.addRegions({
  nav: '#nav'
});

socket = io.connect();

$(function() {
  $('.tip').tooltip();
});
