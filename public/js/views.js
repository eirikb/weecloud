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

    initialize: function() {
      this.listenTo(this.model, 'change:activity', this.activity);
    },

    activity: function() {
      var activity = this.model.get('activity');
      if (!activity) activity = '';
      var mentioned = !! this.model.get('mentioned');
      this.$('.badge').text(activity).toggleClass('badge-important', mentioned);
    },

    open: function() {
      this.model.trigger('open', this.model);
      this.model.set('mentioned', false);
      this.model.set('activity', 0);
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });

  DropdownBufferView = Backbone.View.extend({
    template: _.template($('#dropdown-buffer-template').html()),
    templateOption: _.template($('#dropdown-option-buffer-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'add:buffers', this.addBuffer);
    },

    addBuffer: function(buffer) {
      var tpl = this.templateOption(buffer.toJSON()).trim();
      var $el = $(tpl.trim());
      this.$el.append($el);

      var text = $el.text();
      buffer.on('change:activity', function(b, activity) {
        activity = activity || '';
        $el.text(activity + ' ' + text);

        var totalActivity = buffers.getActivity() || '';
        var mentioned = buffers.getMentioned();
        $('#total-activity').text(totalActivity).toggleClass('badge-important', mentioned);
      });
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
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });

  InputView = Backbone.View.extend({
    el: '#input input',

    initialize: function() {
      var k = new Kibo(this.el);
      var self = this;
      k.down('tab', function() {
        return self.tab();
      });
      k.down('enter', function() {
        return self.enter();
      });

      buffers.on('open', function() {
        if ($('#desktop').is(':hidden')) return;
        self.$el.focus();
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

  UserListView = Backbone.View.extend({
    template: _.template($('#user-list-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'add:users', this.addUser);
      this.listenTo(this.model, 'open', this.open);
    },

    addUser: function(user) {
      var view = new UserView({
        model: user
      });
      this.$el.append(view.render().$el);
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      this.open();
      return this;
    },

    open: function() {
      $('#userlist ul').hide();
      this.$el.show();
      $('#userlist').toggle(this.model.get('type') !== 'private');
      this.model.trigger('scroll-bottom');
    }
  });

  UserView = Backbone.View.extend({
    template: _.template($('#user-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'remove', this.removeUser);
    },

    removeUser: function() {
      this.$el.remove();
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });
});
