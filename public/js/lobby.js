var lobby = lobby || {};

(function() {
    lobby.Connection = Backbone.Model.extend({
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

        tagName: 'li',
        template: _.template($('#connection-template').html()),

        events: {
            'click .destroy': 'clear'
        },

        initialize: function() {
            this.model.on('change', this.render, this);
            this.model.on('delete', this.remove, this);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        clear: function() {
            this.model.destroy();
        }
    });
});


$(function($) {
    lobby.lobbyView = Backbone.View.extend({

        el: '#connect',

        events: {
            'click #connect-btn': 'create'
        },

        initialize: function() {
            this.host = this.$('#host');
            this.port = this.$('#port');
            this.password = this.$('#password');
            this.connections = this.$('#connections')
            lobby.Connections.on('all', this.render, this);
            lobby.Connections.fetch();
        },

        render: function() {
            this.connections.show();
        },

        addOne: function(connection) {
            //var view = new lobby.ConnectionView({
            //model: connection
            //});
            //$('#connections').lobbyend(view.render().el);
        },
        create: function(e) {
            lobby.Connections.create(this.newAttributes());
            return false;
        },
        newAttributes: function() {
            return {
                host: this.host.val().trim(),
                port: this.port.val().trim(),
                password: this.password.val().trim()
            };
        },

    });
});

$(function() {
    new lobby.lobbyView();
});
