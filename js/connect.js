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
      this.model.save();
      return false;
    }
  });


  var model = new Connect.Model({});
  var view = new Connect.View({
    model: model
  });
  view.render();
});
