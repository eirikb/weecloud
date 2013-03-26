$(function() {
  ServerView = Backbone.View.extend({
    template: _.template($('#server-menu-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'add:buffers', this.addBuffer);
    },

    addBuffer: function(buffer) {
      var bufferMenuView = new BufferMenuView({
        model: buffer
      });
      var bufferView = new BufferView({
        model: buffer
      });
      this.$el.after(bufferMenuView.render().$el);
      $('#buffers').children().append(bufferView.render().$el);
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });

  BufferMenuView = Backbone.View.extend({
    template: _.template($('#buffer-menu-template').html()),

    events: {
      'shown': 'open'
    },

    open: function() {
      this.model.trigger('open');
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });

  BufferView = Backbone.View.extend({
    template: _.template($('#buffer-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'open', this.open);
      this.listenTo(this.model, 'add:messages', this.addMessage);
    },

    open: function() {
      var messages = this.model.get('messages');
      if (messages.length === 0) this.getMessages(messages);
      this.scrollBottom();
    },

    getMessages: function(messages) {
      socket.emit('get:messages', this.model.id, 200, function(m) {
        _.each(m, function(message) {
          messages.add(message);
        });
      });
    },

    addMessage: function(message) {
      var view = new MessageView({
        model: message
      });
      this.$el.append(view.render().$el);
      this.scrollBottom();
    },

    scrollBottom: function() {
      $('#buffers').scrollTop($('.tab-pane.active').height());
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });

  MessageView = Backbone.View.extend({
    template: _.template($('#message-template').html()),

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });
});
