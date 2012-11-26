$(function() {
    relay.bufferView = Backbone.View.extend({

        el: '#buffers',

        events: {
        },

        initialize: function() {
            console.log(1, arguments);
            this.model.on('change', this.render, this);
        },

        render: function() {
            console.log(2, arguments);
        }
    });
});
