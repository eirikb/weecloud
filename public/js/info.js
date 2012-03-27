wc.info = (function() {
    var self = {};

    wc.socket.on('disconnect', function() {
        $('#home').show();
        $('#important').hide();
        $('#warning').show().text('Disconnected');
    });

    wc.socket.on('error', function(err) {
        $('#home').show();
        $('#info').hide();
        $('#important').show().text('Error: ' + err);
    });

    wc.socket.on('connect', function() {
        $('#home, #important').hide();
    });

    wc.socket.on('auth', function() {
        $('#info').show().text('Synchronizing...');
    });

    wc.socket.on('synced', function() {
        $('#info').hide();
    });

    return self;
})();

