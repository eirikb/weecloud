var weecloud = {};

weecloud.main = (function() {
    var socket, $status;

    $(function() {
        var $modal = $('.modal'),
        $wrongPass = $modal.find('span').hide();

        $status = $('#status');

        socket = io.connect();

        socket.on('connect', function() {
            weecloud.buffers.clear();

            $status.hide();
            $modal.modal().find('form').submit(function() {
                $wrongPass.hide();
                localStorage.pass = $modal.find('input').val();
                socket.emit('auth', $modal.find('input').val());
                return false;
            });

            if (localStorage.pass) {
                $modal.find('input').val(localStorage.pass);
                $modal.find('button').click();
            }
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

        socket.on('auth', function(ok) {
            if (ok) {
                $modal.modal('hide');
            } else {
                $wrongPass.show();
            }
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

