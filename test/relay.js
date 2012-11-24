var io = require('socket.io-client');
var requester = require('requester');
var Requester = require('requester');

var requester = new Requester();
var url = 'http://localhost:3000';
// This is for connecting to a real WeeChat! (Integration test)
var auth = require('./auth.json');

var options = {
    transports: ['websocket']
};

Object.keys(io.sockets).forEach(function(id) {
    console.log('disconnecting:', id);
    io.sockets[id].disconnect();
});
io.sockets = {};

describe("relay", function() {
    it('should connect to a WeeChat from auth', function() {
        requester.post(url + '/relay', {
            data: auth
        }, function(data) {
            var guid = data.match(/data-guid=\"(\S+)\"/)[1];

            var client = io.connect(url, options);

            client.on('error', function(err) {
                console.log('Error: ', err);
            });

            client.on('connect', function() {
                console.log('connected');
                client.emit('sync', guid);
            });

            client.on('auth', function(res) {
                console.log('auth', res);
                client.emit('read:buffers');
            });

            client.on('buffers', function(buffers) {
                console.log('buffers', buffers);
            });
        });
    });
});
