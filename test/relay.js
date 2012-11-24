var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:3000';
// This is for connecting to a real WeeChat! (Integration test)
var auth = require('./auth.json');

var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe("relay", function() {
    it('should connect to a WeeChat from auth', function() {
        var client = io.connect(socketURL, options);
    });
});
