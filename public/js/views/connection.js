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
            window.lobbyView.connect(this.model);
        }
    });
});
