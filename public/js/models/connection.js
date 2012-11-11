var lobby = lobby || {};

(function() {
    lobby.Connection = Backbone.Model.extend({
        validate: function(attrs) {
            if (!host) return 'Host must be set';
            if (!port) return 'Port must be set';
        },

        defaults: {
            host: '',
            port: 0,
            password: ''
        },
    });
}());
