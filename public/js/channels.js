(function() {
    socket.on('addBuffer', function(buffer) {
        var $channel = $('<a>').text(buffer.name);

        $channel.click(function() {
            buffers.show(buffer.id);
        });

        $('#channels').append($('<li>').append($channel));
    });
})();

