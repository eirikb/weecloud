var w = require('weechat');

var handlers = {};

exports.init = function(socket, ref, data) {
    var weechat;
    if (!handlers[ref]) {
        weechat = w.connect(data.port, data.host, data.password, function(err) {
            if (!err) {
                handlers[ref] = new Handler(weechat);
                handlers[ref].addSocket(socket);
            } else {
                socket.emit('error', 'Oh noes, errors! :(   -   ' + err);
            }
        });
    } else {
        handlers[ref].addSocket(socket);
    }
};

function Handler(weechat) {
    if (! (this instanceof Handler)) return new Handler(weechat);
    var sockets = [];

    function emit(a, b) {
        sockets.forEach(function(socket) {
            socket.emit(a, b);
        });
    }

    weechat.on('open', function(buffers) {
        buffers.forEach(function(buffer) {
            if (buffer && buffer.pointers) {
                buffer.id = buffer.pointers[0];
                emit('addBuffer', buffer);
            } else {
                console.error('Buffer has no pointers: ', buffer);
            }
        });
    });

    weechat.on('close', function(buffers) {
        buffers.forEach(function(buffer) {
            emit('closeBuffer', buffer.buffer);
        });
    });

    weechat.on('line', function(lines) {
        lines.forEach(function(line) {
            emit('msg', {
                bufferid: line.buffer,
                from: w.style(line.prefix),
                date: line.date,
                message: w.style(line.message)
            });
        });
    });

    this.addSocket = function(socket) {
        sockets.push(socket);

        socket.on('msg', function(msg) {
            weechat.write('input ' + msg.id + ' ' + msg.line);
        });

        socket.emit('auth', true);

        weechat.bufferlines(function(buffers) {
            buffers.forEach(function(buffer) {
                // Only 10 last lines
                buffer.lines = buffer.lines.slice( - 10);
                buffer.lines = buffer.lines.map(function(line) {
                    return {
                        prefix: w.style(line.prefix),
                        date: line.date,
                        message: w.style(line.message)
                    };
                });
                socket.emit('addBuffer', buffer);
            });
        });
    };
}

