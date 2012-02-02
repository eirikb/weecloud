#! /usr/bin / env node

var static = require('node-static'),
weechat = require('weechat/weechat.js');

if (process.argv.length < 6) {
    console.log('Must specify:');
    console.log('  <int> - listening port for webapp');
    console.log('  <string> - password for webapp');
    console.log('  <int> - port for WeeChat Relay Protocol');
    console.log('  <string> - password for WeeChat Relay Protocol');
    console.log('\nUsage: weecloud 7000 8000 test');
    process.exit();
}

var appPort = process.env.PORT
//parseInt(process.argv[2], 10),
appPassword = process.argv[3],
weePort = parseInt(process.argv[4], 10),
weePassword = process.argv[5];

var file = new(static.Server)('./static'),
server = require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    });
}),
io = require('socket.io').listen(server);

server.listen(appPort);

weechat.connect(weePort, weePassword, function(err) {
    if (!err) {
        init();
    }
});

function init() {
    io.sockets.on('connection', function(socket) {

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

        socket.on('auth', function(password) {
            if (password === appPassword) {
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
            } else {
                socket.emit('auth', false);
            }
        });
    });
}

