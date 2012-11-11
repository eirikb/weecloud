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

(function() {
    var ConnectionList = Backbone.Collection.extend({
        model: lobby.Connection,
        localStorage: new Store('connections')
    });

    lobby.Connections = new ConnectionList();
}());


$(function() {
    lobby.ConnectionView = Backbone.View.extend({

        tagName: 'tr',
        template: _.template($('#connection-template').html()),

        events: {
            'click .destroy': 'clear',
            'click .connect': 'connect'
        },

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        clear: function() {
            this.model.destroy();
        },

        connect: function() {
            var host = this.model.get('host');
            var port = this.model.get('port');
            var password = this.model.get('password');
            window.lobbyView.connect(host, port, password);
        }
    });
});


$(function() {
    lobby.lobbyView = Backbone.View.extend({

        el: '#connect',

        events: {
            'click #connect-btn': 'create'
        },

        initialize: function() {
            this.host = this.$('#host');
            this.port = this.$('#port');
            this.password = this.$('#password');
            this.connectBtn = this.$('#connect-btn');
            this.connections = this.$('#connections')

            this.$('.passinfo').tooltip();

            lobby.Connections.on('add', this.addOne, this);
            lobby.Connections.on('all', this.render, this);
            lobby.Connections.on('reset', this.addAll, this);
            lobby.Connections.fetch();
        },

        render: function() {
            if (lobby.Connections.length) this.connections.show();
            else this.connections.hide();
        },

        addOne: function(connection) {
            var view = new lobby.ConnectionView({
                model: connection
            });
            $('#connections tbody').append(view.render().el);
        },

        addAll: function() {
            lobby.Connections.each(this.addOne, this);
        },

        create: function(e) {
            if (!$('#remember').is(':checked')) return;

            lobby.Connections.create(this.newAttributes());
        },

        newAttributes: function() {
            return {
                host: this.host.val().trim(),
                port: this.port.val().trim(),
                password: this.password.val().trim()
            };
        },

        connect: function(host, port, password) {
            this.host.val(host);
            this.port.val(port);
            this.password.val(password);
            this.connectBtn.click();
        }
    });
});

$(function() {
    window.lobbyView = new lobby.lobbyView();
});
