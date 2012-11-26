$(function() {
    relay.bufferView = Backbone.View.extend({

        el: '#buffers',

        events: {
        },

        initialize: function() {
            console.log(1, arguments);
        },

        render: function() {
            console.log(2, arguments);
        }
    });
});
