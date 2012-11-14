$(function() {

    var socket = io.connect();
    console.log('connecting...');
    socket.on('connect', function() {
        var guid = $('#socket').data('guid');
        console.log('syncing (', guid, ')...');
        socket.emit('sync', guid);
    });

    socket.on('auth', function(status) {
        if (status) new relay.relayView();
        else console.error('sync fail');
    });

    Backbone.sync = function(method, model) {
        var options = Array.prototype.slice.call(arguments).slice(2);

        ({
            read: function() {
                console.log('read!', model, options);
            }
        })[method]();
    };
});
