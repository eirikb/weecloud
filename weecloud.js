var weechat = require('./weechat.js/weechat.js');

var refs = [];

exports.init = function(socket, data) {
    if (refs.indexOf(data) < 0) {
        weechat.connect(data.port, data.host, data.password, function(err) {
            if (!err) {
                refs.push(data);
                success(socket);
            } else {
                socket.emit('error', 'Oh noes, errors! :(   -   ' + err);
            }
        });
    } else {
        success(socket);
    }
};

function success(socket) {
    function login() {
        weechat.bufferlines(function(buffers) {
            buffers.forEach(function(buffer) {
                // Only 10 last lines
                buffer.lines = buffer.lines.slice( - 10);
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
        if (buffer && buffer.pointers) {
            buffer.id = buffer.pointers[0];
            socket.emit('addBuffer', buffer);
        } else {
            console.error('Buffer has no pointers: ', buffer);
        }
    });

    weechat.on('close', function(buffer) {
        socket.emit('closeBuffer', buffer.buffer);
    });

    weechat.on('line', function(lines) {
        lines.forEach(function(line) {
            console.log(weechat.style(line.prefix), weechat.style(line.message));
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

