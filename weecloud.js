var w = require('weechat'),
sanitize = require('validator').sanitize;

var handlers = {};

function getHandler(data) {
    var h = handlers;

    ['host', 'port', 'password'].forEach(function(n) {
        if (h) h = h[data[n]];
    });
    return h;
}

function putHandler(data, handler) {
    var h = handlers[data.host] = handlers[data.host] || {};
    h = h[data.port] = {};
    h[data.password] = handler;
}

exports.init = function(socket, data) {
    var weechat, handler = getHandler(data);

    if (!handler) {
        weechat = w.connect(data.port, data.host, data.password, function(err) {
            if (!err) {
                handler = new Handler(weechat);
                putHandler(data, handler);
                handler.addSocket(socket);
                socket.emit('auth');
            } else {
                socket.emit('error', 'Oh noes, errors! :(   -   ' + err);
            }
        });
        weechat.on('error', function(err) {
            socket.emit('error', 'Something borked  -  ' + err);
            console.error(err);
        });
    } else {
        handler.addSocket(socket);
    }
};

function getMessage(message) {
    message = w.style(message).map(function(part) {
        part.text = sanitize(part.text).entityEncode();
        return part;
    });
    return message;
}

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
                emit('buffer', buffer);
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
                message: getMessage(line.message)
            });
        });
    });

    this.addSocket = function(socket) {
        sockets.push(socket);

        socket.on('msg', function(msg) {
            weechat.write('input ' + msg.id + ' ' + msg.line);
        });

        socket.emit('auth', true);

        // Only 30 last lines
        weechat.bufferlines(30, function(buffers) {
            buffers.forEach(function(buffer) {
                buffer.lines = buffer.lines.map(function(line) {
                    return {
                        prefix: w.style(line.prefix),
                        date: line.date,
                        message: getMessage(line.message)
                    };
                });
                socket.emit('buffer', buffer);
            });
            socket.emit('synced', 'done');
        });
    };
}

