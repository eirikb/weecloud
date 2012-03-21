(function() {

    function setActive($channel) {
        $('#channels .active').removeClass('active');
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
            buffers.show(buffer.id);
            $('select').val(buffer.id);
        });

        setActive($channel);

        $('#channels').append($('<li>').append($channel));
        $('select').append($sChannel);
    });

})();

