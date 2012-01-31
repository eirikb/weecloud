var static = require('node-static'),
weechat = require('./weechat.js/weechat.js');

var file = new(static.Server)('./static'),
server = require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    });
}),
io = require('socket.io').listen(server);

server.listen(7000);

weechat.connect(8000, 'test', function(ok) {
    if (ok) {
        init();
    }
});

function init() {
    io.sockets.on('connection', function(socket) {
        weechat.bufferlines(function(buffers) {
            buffers.forEach(function(buffer) {
                buffer.lines = buffer.lines.map(function(line) {
                    return {
                        prefix: line.prefixParts,
                        message: line.messageParts
                    };
                });
                socket.emit('addBuffer', buffer);
            });
        });

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
                from: line.prefixParts,
                message: line.messageParts
            });
        });

        socket.on('msg', function(msg) {
            weechat.write('input ' + msg.id + ' ' + msg.line);
        });
    });
}

