var static = require('node-static'),
weechat = require('./weechat.js'),
color = require('./color.js');

var file = new(static.Server)('./static'),
server = require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    });
}),
io = require('socket.io').listen(server);

var getlines = 'hdata buffer:gui_buffers(*)/own_lines/first_line(*)/data date,displayed,prefix,message',
getbuffers = 'hdata buffer:gui_buffers(*) number,full_name,short_name,type,nicklist,title,local_variables';

server.listen(7000);

weechat.connect(8000, 'test', function(ok) {
    if (ok) {
        init();
    }
});

function init() {
    io.sockets.on('connection', function(socket) {
        var buffers;
        weechat.write('sync');

        weechat.on('_buffer_opened', function(obj) {
            console.log('**********');
            console.log(obj);
        });

        weechat.on('_buffer_line_added', function(obj) {
            obj.objects.forEach(function(o) {
                console.log(o)
                socket.emit('msg', {
                    key: o.buffer.toString(),
                    from: color.parse(o.prefix),
                    msg: color.parse(o.message)
                });
            });
        });

        getBuffers(function(b) {
            buffers = b;
            Object.keys(buffers).map(function(key) {
                var buffer = b[key];
                return {
                    key: key,
                    name: buffer.full_name,
                    title: buffer.title,
                    lines: buffer.lines.map(function(line) {
                        return color.parse(line.prefix + ': ' + line.message);
                    })
                };
            }).forEach(function(buffer) {
                socket.emit('addBuffer', buffer);
            });
        });

        socket.on('msg', function(msg) {
            weechat.write('input ' + buffers[msg.key].full_name + ' ' + msg.line);
        });
    });
}

function getBuffers(cb) {
    weechat.write(getbuffers, function(o) {
        var buffers = {};
        o.objects.forEach(function(buffer) {
            buffer.lines = [];
            buffers[buffer.pointers[0]] = buffer;
        });
        weechat.write(getlines, function(o) {
            o.objects.forEach(function(line) {
                buffers[line.pointers[0]].lines.push(line);
            });
            cb(buffers);
        });
    });
}

