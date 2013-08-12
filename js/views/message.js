$(function() {
  MessageView = Backbone.Marionette.ItemView.extend({
    template: _.template($('#message-template').html()),

    events: {
      'click .nick': 'clickNick'
    },

    clickNick: function() {
      var user = this.model.get('user');
      var nick = user.title;
      if (!nick) return false;

      inputView.setNick(nick);
      inputView.focus();
      return false;
    }
  });
});
