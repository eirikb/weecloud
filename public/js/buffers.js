(function() {

    function appendLine($buffer, date, from, message) {
        var from = weecloud.color(from),
        message = weecloud.color(message),
        $wrapper = $('<p>');

        $wrapper.append(from).append(message);

        $buffer.append($wrapper);
    }

    socket.on('addBuffer', function(buffer) {
        var $buffer = $('<div>');

        $buffer.data('id', buffer.id);
        $('#buffers div').hide();
        $('#buffers').append($buffer);

        $.each(buffer.lines, function(i, line) {
            var from = weecloud.color(line.prefix),
            message = weecloud.color(line.message);

            appendLine($buffer, line.date, line.prefix, line.message);
        });

    });
})();

