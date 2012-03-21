(function() {
    socket.on('disconnect', function() {
        $('#home').show();
        $('#important').hide();
        $('#info').show().text('Disconnected');
    });

    socket.on('error', function(err) {
        $('#home').show();
        $('#info').hide();
        $('#important').show().text('Error: ' + err);
    });

    socket.on('auth', function() {
        $('#info').show().text('Synchronizing...');
    });

    socket.on('synced', function() {
        $('#info').hide();
    });
})();

