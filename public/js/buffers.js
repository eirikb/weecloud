weecloud.buffers = (function() {
    var $current, $container, self = {},
    containerId = '#buffers';

    $(function() {
        $container = $(containerId);
    });

    function appendLine($buffer, date, from, message) {
        var $wrapper = $('<p>');

        from = weecloud.color(from);
        message = weecloud.color(message);

        // Fade lines that might not have nicknames
        if (from.match(/--/)) $wrapper.css('opacity', 0.5);
        date = builddate(date);

        $wrapper.append(date);
        $wrapper.append(from + ': ').append(message);

        $buffer.append($wrapper);
        if ($buffer.is(':visible')) {
            scrollBottom($buffer);
        }
    }

    function scrollBottom($buffer) {
        $container.scrollTop($buffer.prop('scrollHeight') + 100);
    }

    socket.on('buffer', function(buffer) {
        var $buffer = $('<div>');

        $buffer.attr('id', 'buffer-' + buffer.id);

        $container.append($buffer);
        self.show(buffer.id);

        $.each(buffer.lines, function(i, line) {
            appendLine($buffer, line.date, line.prefix, line.message);
        });
    });

    socket.on('msg', function(msg) {
        var $buffer = self.getByBufferId(msg.bufferid);
        appendLine($buffer, msg.date, msg.from, msg.message);
    });

    socket.on('disconnect', function() {
        $container.empty();
    });

    self.show = function(bufferId) {
        var $buffer = self.getByBufferId(bufferId);

        // Hide every buffer
        $container.children('div').hide();
        $buffer.show();

        scrollBottom($buffer);
    };

    self.getByBufferId = function(bufferId) {
        return $container.find('#buffer-' + bufferId);
    };

    self.getCurrent = function() {
        return $current;
    };

    return self;
})();

