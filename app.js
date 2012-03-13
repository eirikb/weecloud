var express = require('express'),
weecloud = require('./weecloud.js');

var app = module.exports = express.createServer(),
io = require('socket.io').listen(app),
port = process.env.PORT || 5000,
refs = {},
pkg = require('./package.json');

io.set('log level', 1);

app.configure(function() {
    app.set('view options', {
        layout: false
    });
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    var host = req.socket.remoteAddress;
    console.log(new Date(), host);
    if (req.headers['x-forwarded-for']) {
        host = req.headers['x-forwarded-for'];
    }
    res.render('index', {
        version: pkg.version,
        host: host
    });
});

app.get('/relay/:guid', function(req, res) {
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
        var data = refs[g];
        if (data) {
            weecloud.init(socket, data);
        } else {
            socket.emit('error', 'Unkown guid: ' + g);
        }
    });
});

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
    return S4() + S4() + S4();
}

app.listen(port);

