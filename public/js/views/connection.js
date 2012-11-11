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
