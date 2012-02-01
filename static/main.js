var weecloud = {};

$(function() {
    var socket, current, $input = $('input'),
    $status = $('#status'),
    active = 'active';

    socket = io.connect();

    socket.on('connect', function() {
        buffers = {};
        $tabs.empty();
        $tabsContent.empty();
        $status.hide();
    });

    socket.on('disconnect', function() {
        $tabs.empty();
        $tabsContent.empty();
        $status.show();
    });

    socket.on('msg', function(msg) {
        append(msg.bufferid, parseParts(msg.from) + ': ' + parseParts(msg.message));
    });

    socket.on('addBuffer', function(buffer) {
        addTab(buffer);
        if (buffer.lines) {
            $.each(buffer.lines, function(i, line) {
                append(buffer.id, parseParts(line.prefx) + parseParts(line.message));
            });
        }
    });

    $(window).resize(function() {
        $tabsContent.height(window.innerHeight - 90);
    }).resize();
});

