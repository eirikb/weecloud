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
            this.connections = this.$('#connections');

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

        connect: function(model) {
            this.host.val(model.get('host'));
            this.port.val(model.get('port'));
            this.password.val(model.get('password'));
            this.connectBtn.click();
        }
    });
});
