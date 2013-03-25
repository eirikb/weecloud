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
      $('#buffers').append(bufferView.render().$el);
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
      'show': 'open'
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

      this.$el.nanoScroller({
        scroll: 'bottom'
      });
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
      this.$el.children().append(view.render().$el);
      this.$el.nanoScroller({
        scroll: 'bottom'
      });
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      this.$el.nanoScroller();
      return this;
    }
  });

  MessageView = Backbone.View.extend({
    template: _.template($('#message-template').html()),

    render: function() {
      var text = utils.color(this.model.get('message'));
      var from = utils.color(this.model.get('from'));
      this.model.set('text', text);
      this.model.set('from', from);

      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });
});
