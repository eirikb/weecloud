(function() {

    function setActive($channel) {
        $('#channellist .active').removeClass('active');
        $channel.addClass('active');
    }

    $(function() {
        $('select').change(function() {
            $(this).find(':selected').each(function() {
                $(this).data('ref').click();
            });
        });
    });

    socket.on('buffer', function(buffer) {
        var $channel = $('<a>').text(buffer.name),
        $sChannel = $('<option>').text(buffer.name);

        $sChannel.data('ref', $channel);
        $sChannel.val(buffer.id);

        $channel.click(function() {
            setActive($channel);
            weecloud.buffers.show(buffer.id);
            $('select').val(buffer.id);
        });

        setActive($channel);

        $('#channellist ul').append($('<li>').append($channel));
        $('select').append($sChannel);
    });

    socket.on('disconnect', function() {
        $('#channellist ul').empty();
    });

})();

