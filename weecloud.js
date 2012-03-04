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
                // Only 10 last lines
                buffer.lines = buffer.lines.slice(- 10);
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

    weechat.on('open', function(buffer) {
        buffer.id = buffer.pointers[0];
        socket.emit('addBuffer', buffer);
    });

    weechat.on('close', function(buffer) {
        socket.emit('closeBuffer', buffer.buffer);
    });

    weechat.on('line', function(lines) {
        lines.forEach(function(line) {
            socket.emit('msg', {
                bufferid: line.buffer,
                from: weechat.style(line.prefix),
               message: weechat.style(line.message)
            });
        });
    });

    socket.on('msg', function(msg) {
        weechat.write('input ' + msg.id + ' ' + msg.line);
    });

    socket.emit('auth', true);
    login();
}

