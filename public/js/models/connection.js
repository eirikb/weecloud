var lobby = lobby || {};

(function() {
    lobby.Connection = Backbone.Model.extend({
        defaults: {
            host: '',
            port: 0,
            password: ''
        }
    });
}());
