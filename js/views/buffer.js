$(function() {
  BufferView = Backbone.View.extend({
    template: _.template($('#buffer-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'open', this.open);
      this.listenTo(this.model, 'add:messages', this.addMessage);
      this.listenTo(this.model, 'scroll-bottom', this.scrollBottom);
    },

    open: function() {
      var messages = this.model.get('messages');
      if (!messages.ready) this.getMessages(messages);
      var users = this.model.get('users');
      if (!users.ready) this.getUsers(users);
      this.scrollBottom();

      socket.emit('open', this.model.id, this.model.get('number'));
    },

    getMessages: function(messages) {
      messages.ready = true;
      socket.emit('get:messages', this.model.id, 20, function(m) {
        _.each(m, function(message) {
          messages.add(message);
        });
      });
    },

    getUsers: function(users) {
      users.ready = true;
      var userListView = new UserListView({
        model: this.model
      });
      $('#userlist').append(userListView.render().$el);

      socket.emit('get:users', this.model.id, function(u) {
        _.each(u, function(user) {
          users.add(user);
        });
      });
    },

    addMessage: function(message) {
      this.model.addUserIdToActivityList(message.get('user').id);
      var view = new MessageView({
        model: message
      });
      this.$el.append(view.render().$el);
      this.scrollBottom();

      if (this.model === buffers.active) return;
      if (message.get('type') !== 'message') return;
      if (message.get('highlight')) this.model.setMentioned();
      this.model.incActivity();
    },

    scrollBottom: function() {
      if (!this.$el.is(':visible')) return;

      $('#buffers').scrollTop($('.tab-pane.active').height());
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });
});
