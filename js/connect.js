App.module('Connect', function(Connect, App, Backbone) {
  var codes = {
    ECONNREFUSED: 'Unable to connect',
    WRONGPASS: 'Wrong password'
  };

  Connect.Model = Backbone.Model.extend({
    urlRoot: 'connect',
    defaults: {
      host: '',
      port: '',
      password: '',
      ssl: false,
      remember: false
    }
  });

  Connect.View = Backbone.Marionette.ItemView.extend({
    el: '#connect-container',
    template: '#connect-template',

    events: {
      'submit': 'submit'
    },

    connecting: function() {
      this.$('button').text('Connecting...').addClass('disabled');
      self.$('#error').addClass('hide');
    },

    resetBtn: function() {
      this.$('button').text('Connect').removeClass('disabled');
    },

    submit: function() {
      var data = Backbone.Syphon.serialize(this);

      if (data.remember) localStorage.connect = JSON.stringify(model.toJSON());
      else localStorage.connect = '';

      this.connecting();
      var self = this;
      this.model.save(data, {
        success: function() {
          self.resetBtn();
          App.init();
        },
        error: function(model, err) {
          self.resetBtn();

          var code = codes[err.code];
          if (!code) code = err.code;
          self.$('#error').text(code).removeClass('hide');
        }
      });
      return false;
    }
  });

  var model = new Connect.Model({});
  try {
    var data = JSON.parse(localStorage.connect);
    model.set(data);
  } catch (e) {}

  var view = new Connect.View({
    model: model
  });
  view.render();
});
