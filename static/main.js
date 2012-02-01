var weecloud = {};

weecloud.main = (function() {
    var socket, $status;

    $(function() {
        $status = $('#status');

        socket = io.connect();

        socket.on('connect', function() {
            weecloud.buffers.clear();

            $status.hide();
        });

        socket.on('disconnect', function() {
            weecloud.buffers.clear();
            $status.show();
        });

        socket.on('msg', function(msg) {
            weecloud.buffers.msg(msg);
        });

        socket.on('addBuffer', function(buffer) {
            weecloud.buffers.addBuffer(buffer);
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

