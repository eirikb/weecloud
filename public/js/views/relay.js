$(function() {
    relay.relayView = Backbone.View.extend({

        events: {},

        initialize: function() {
            relay.Buffers.fetch();
        },

        render: function() {}
    });
});
