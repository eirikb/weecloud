var weechat = require('weechat/weechat.js');

//weechat.connect(weePort, weePassword, function(err) {
 //   if (!err) {
  //      init();
  //  }
//});

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

