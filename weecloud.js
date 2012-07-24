var WeeChat = require('weechat');
var sanitize = require('validator').sanitize;

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
    var handler = getHandler(data);
    var weeChat = new WeeChat();


    if (!handler) {
        weeChat.connect(data.host, data.port, data.password, function(err) {
            if (!err) {
                handler = new Handler(weeChat);
                putHandler(data, handler);
                handler.addSocket(socket);
                socket.emit('auth');
            } else {
                socket.emit('error', 'Oh noes, errors! :(   -   ' + err);
            }
        });
        weeChat.on('error', function(err) {
            socket.emit('error', 'Something borked  -  ' + err);
            console.error(err);
        });
    } else {
        handler.addSocket(socket);
    }
};

function getMessage(w, message) {
    message = w.style(message).map(function(part) {
        part.text = sanitize(part.text).entityEncode();
        return part;
    });
    return message;
}

function Handler(weeChat) {
    if (! (this instanceof Handler)) return new Handler(weeChat);
    var sockets = [];

    function emit(a, b) {
        sockets.forEach(function(socket) {
            socket.emit(a, b);
        });
    }

    weeChat.on('open', function(buffers) {
        buffers.forEach(function(buffer) {
            if (buffer && buffer.pointers) {
                buffer.id = buffer.pointers[0];
                emit('buffer', buffer);
            } else {
                console.error('Buffer has no pointers: ', buffer);
            }
        });
    });

    weeChat.on('close', function(buffers) {
        buffers.forEach(function(buffer) {
            emit('closeBuffer', buffer.buffer);
        });
    });

    weeChat.on('line', function(lines) {
        lines.forEach(function(line) {
            emit('msg', {
                bufferid: line.buffer,
                from: weeChat.style(line.prefix),
                date: line.date,
                message: getMessage(weeChat, line.message)
            });
        });
    });

    this.addSocket = function(socket) {
        sockets.push(socket);

        socket.on('msg', function(msg) {
            weeChat.write('input ' + msg.id + ' ' + msg.line);
        });

        socket.emit('auth', true);

        // Only 30 last lines
        weeChat.bufferlines(30, function(buffers) {
            buffers.forEach(function(buffer) {
                buffer.lines = buffer.lines.map(function(line) {
                    return {
                        prefix: weeChat.style(line.prefix),
                        date: line.date,
                        message: getMessage(weeChat, line.message)
                    };
                });
                socket.emit('buffer', buffer);
            });
            socket.emit('synced', 'done');
        });
    };
}

