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
      if (messages.length > 0) return;

      socket.emit('get:messages', this.model.id, 20, function(m) {
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
      var text = _.map(this.model.get('message'), function(m) {
        return m.text;
      }).join('');
      this.model.set('text', text);

      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });
});
