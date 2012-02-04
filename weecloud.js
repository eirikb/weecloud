var weechat = require('weechat');

exports.init = function(socket, data) {
    weechat.connect(data.port, data.host, data.password, function(err) {
        if (!err) {
            success(socket);
        } else {
            socket.emit('error', 'Oh noes, errors! :(   -   ' + err);
        }
    });
};

function success(socket) {
    function login() {
        weechat.bufferlines(function(buffers) {
            buffers.forEach(function(buffer) {
                buffer.lines = buffer.lines.map(function(line) {
                    return {
                        prefix: weechat.style(line.prefix),
                        message: weechat.style(line.message)
                    };
                });
                socket.emit('addBuffer', buffer);
            });
        });
    }

    weechat.onOpen(function(buffer) {
        buffer.id = buffer.pointers[0];
        socket.emit('addBuffer', buffer);
    });

    weechat.onClose(function(buffer) {
        console.log('close buffer', buffer);
        socket.emit('closeBuffer', buffer.buffer);
    });

    weechat.onLine(function(line) {
        socket.emit('msg', {
            bufferid: line.buffer,
            from: weechat.style(line.prefix),
            message: weechat.style(line.message)
        });
    });

    socket.on('msg', function(msg) {
        weechat.write('input ' + msg.id + ' ' + msg.line);
    });

    socket.emit('auth', true);
    login();
}

