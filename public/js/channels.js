(function() {
    socket.on('addBuffer', function(buffer) {
        var $channel = $('<p>').text(buffer.name);

        $('#channels').append($channel);
    });
})();

