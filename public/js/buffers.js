buffers = (function() {
    var self = {};

    function appendLine($buffer, date, from, message) {
        var from = weecloud.color(from),
        message = weecloud.color(message),
        $wrapper = $('<p>');

        $wrapper.append(from).append(message);

        $buffer.append($wrapper);
        if ($buffer.is(':visible')) {
            scrollBottom($buffer);
        }
    }

    function scrollBottom($buffer) {
        $('#buffers').scrollTop($buffer.prop('scrollHeight'));
    }

    socket.on('buffer', function(buffer) {
        var $buffer = $('<div>');

        $buffer.attr('id', 'buffer-' + buffer.id);
        $('#buffers').append($buffer);
        self.show(buffer.id);

        $.each(buffer.lines, function(i, line) {
            appendLine($buffer, line.date, line.prefix, line.message);
        });
    });

    socket.on('msg', function(msg) {
        var $buffer = $('#buffer-' + msg.bufferid);
        appendLine($buffer, msg.date, msg.from, msg.message);
    });

    self.show = function(bufferId) {
        var $buffer = $('#buffer-' + bufferId);

        $('#buffers div').hide();
        $buffer.show();

        scrollBottom($buffer);
    };

    return self;
})();

