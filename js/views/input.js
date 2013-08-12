$(function() {
  InputView = Backbone.View.extend({
    el: '#input input',

    initialize: function() {
      buffers.on('open', function() {
        if ($('#desktop').is(':hidden')) return;
        //self.$el.focus();
      });
    },

    tab: function() {
      var lineSplit = this.$el.val().split(' ');
      var nickPart = _.last(lineSplit);
      var user = buffers.active.findByNickPart(nickPart);
      if (!user) return false;

      lineSplit.pop();
      var line = lineSplit.join(' ');
      this.$el.val(line);
      this.setNick(user.get('title'));
      return false;
    },

    setNick: function(nick) {
      var line = this.$el.val();
      var empty = line.length === 0;

      if (!empty) line += ' ';
      line += nick;
      if (empty) line += ':';
      line += ' ';

      this.$el.val(line);
    },

    enter: function() {
      var buffer = buffers.active;
      socket.emit('message', buffer.id, this.$el.val());
      this.$el.val('');
    },

    focus: function() {
      if ($('#desktop').is(':hidden')) return;
      this.$el.focus();
    }
  });
});
