(function() {

    function setActive($channel) {
        $('#channels .active').removeClass('active');
        $channel.addClass('active');
    }

    socket.on('addBuffer', function(buffer) {
        var $channel = $('<a>').text(buffer.name);

        $channel.click(function() {
            setActive($channel);
            buffers.show(buffer.id);
        });

        setActive($channel);

        $('#channels').append($('<li>').append($channel));
    });

})();

