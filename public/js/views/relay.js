$(function() {
    relay.relayView = Backbone.View.extend({

        events: {},

        initialize: function() {
            relay.Buffers.fetch();
            relay.Buffers.on('add', this.addOne, this);
            relay.Buffers.on('all', this.render, this);
            relay.Buffers.on('reset', this.addAll, this);
        },

        render: function() {
            console.log(1, arguments);
        },

        addOne: function() {
            console.log(2, arguments);
        },

        addAll: function() {
            console.log(3, arguments);
            relay.Buffers.each(this.addOne, this);
        }
    });
});
