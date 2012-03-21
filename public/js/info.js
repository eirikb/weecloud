(function() {

    socket.on('disconnect', function() {
        $('#home').show();
        $('#important').hide();
        $('#warning').show().text('Disconnected');
    });

    socket.on('error', function(err) {
        $('#home').show();
        $('#info').hide();
        $('#important').show().text('Error: ' + err);
    });

    socket.on('connect', function() {
        $('#home, #important').hide();
    });

    socket.on('auth', function() {
        $('#info').show().text('Synchronizing...');
    });

    socket.on('synced', function() {
        $('#info').hide();
    });

})();

