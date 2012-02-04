var express = require('express'),
weecloud = require('./weecloud.js');

var app = module.exports = express.createServer(),
io = require('socket.io').listen(app),
port = process.env.PORT || 5000,
refs = {};

io.set('log level', 1);

app.configure(function() {
    app.set('view options', {
        layout: false
    });
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    //app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    var host = req.socket.remoteAddress;
    if (req.headers['x-forwarded-for']) {
        host = req.headers['x-forwarded-for'];
    }
    res.render('index', {
        host: host
    });
});

app.get('/relay/:guid', function(req, res) {
    var g = req.params.guid;

    res.render('relay');
});

app.post('/relay', function(req, res) {
    var g, b = req.body;

    if (b.host && b.port && b.password) {
        g = guid();
        refs[g] = b;
        res.redirect('/relay/' + g);
    } else {
        res.redirect('/');
    }
});

io.sockets.on('connection', function(socket) {
    socket.on('sync', function(g) {
        var ref = refs[g];
        if (ref) {
            weecloud.init(socket, ref);
        } else {
            socket.emit('error', 'Unkown guid: ' + g);
        }
    });
});

function guid() {
    return Math.floor(Math.random() * 10000);
}

app.listen(port);

