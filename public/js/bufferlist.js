(function() {
    var $container, containerId = '#bufferlist';

    $(function() {
        $container = $(containerId);

        $('select').change(function() {
            $(this).find(':selected').each(function() {
                $(this).data('ref').click();
            });
        });
    });

    function setActive($buffer) {
        // Remove active from every buffer
        $container.find('.active').removeClass('active');
        $buffer.addClass('active');
        $buffer.data('count', 0);
        updateCount($buffer);
        $current = $buffer;
    }

    function updateCount($buffer) {
        var count = $buffer.data('count'),
        $counter = $buffer.find('span');

        if (count <= 0) $counter.hide();
        else $counter.show().text('(' + count + ')');
    }

    socket.on('buffer', function(buffer) {
        var $buffer = $('<a>').text(buffer.name),
        $sBuffer = $('<option>').text(buffer.name);

        // For update counting
        $buffer.append('<span>');

        $buffer.attr('id', 'bufferlist-' + buffer.id);
        $sBuffer.data('ref', $buffer);
        $sBuffer.val(buffer.id);

        $buffer.click(function() {
            setActive($buffer);
            weecloud.buffers.show(buffer.id);
            $('select').val(buffer.id);
        });

        setActive($buffer);

        $container.find('ul').append($('<li>').append($buffer));
        $('select').append($sBuffer);
    });

    socket.on('disconnect', function() {
        $container.empty();
    });

    socket.on('msg', function(msg) {
        var $buffer = $container.find('#bufferlist-' + msg.bufferid),
        count = $buffer.data('count');

        if ($buffer !== $current) {
            count++;
            $buffer.data('count', count);
            updateCount($buffer);
        }
    });

})();

