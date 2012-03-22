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
    }

    socket.on('buffer', function(buffer) {
        var $buffer = $('<a>').text(buffer.name),
        $sBuffer = $('<option>').text(buffer.name);

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

    socket.on('msg', function(msg) {});

})();

