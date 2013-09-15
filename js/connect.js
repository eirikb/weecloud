App.module('Connect', function(Connect, App, Backbone) {
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

    submit: function() {
      var data = Backbone.Syphon.serialize(this);
      this.model.set(data);

      if (data.remember) localStorage.connect = JSON.stringify(model.toJSON());
      else localStorage.connect = '';

      this.model.save();
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


  view.submit();
});
