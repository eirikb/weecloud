var weecloud = {};

weecloud.main = (function() {
    var socket, $status;

    $(function() {
        var $status = $('#status');

        socket = io.connect();

        socket.on('connect', function() {
            var g = location.pathname.replace(/^\/.+\//, '');
            $status.text('Synchronizing...');
            socket.emit('sync', g);
        });

        socket.on('error', function(msg) {
            $('.container-fluid > div').hide();
            $status.text(msg);
            $('#info, #retry').show();
        });

        socket.on('msg', function(msg) {
            weecloud.buffers.msg(msg);
        });

        socket.on('addBuffer', function(buffer) {
            $('#info').hide();
            $('#buffers').show();

            weecloud.buffers.addBuffer(buffer);
        });

        socket.on('disconnect', function() {
            $('.container-fluid > div').hide();
            $status.text('Got disconnected. Something borked');
            $('#info, #retry').show();
        });
    });

    function msg(line) {
        socket.emit('msg', {
            id: weecloud.buffers.current(),
            line: line
        });
    }

    return {
        msg: msg
    };
})();

