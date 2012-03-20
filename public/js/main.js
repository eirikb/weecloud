var weecloud = {};

// Global socket
socket = io.connect();

socket.on('connect', function() {
    $(function() {
        var guid = $('#guid').val();
        if (!guid) guid = location.hash.slice(1);
        location.hash = guid;

        socket.emit('sync', guid);
    });
});

