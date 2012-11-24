$(function() {

    Backbone.sync = function(method, model, options) {
        if (model.type) socket.emit(method + ':' + model.type, options);
        else console.log('Oh noes, no type:', arguments);
        //var options = Array.prototype.slice.call(arguments).slice(2);
        /*
        ({
            read: function() {
                console.log('read!', model, options);
            }
        })[method]();
       */
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

    socket.on('buffers', function(buffers) {
        console.log(buffers);
    });

    socket.on('error', function(err) {
        console.log('Error from server:', err);
    });
});
