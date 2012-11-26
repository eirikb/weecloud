$(function() {

    Backbone.sync = function(method, model, options) {
        if (model.type) {
            socket.emit(method + ':' + model.type, options, function(buffers) {
                console.log('response', buffers);
                options.success(buffers);
            });
        } else {
            console.log('Oh noes, no type:', arguments);
        }
    };

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

    socket.on('buffers', function(buffers) {});

    socket.on('error', function(err) {
        console.log('Error from server:', err);
    });
});
