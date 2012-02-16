express require('express')
request require('request')
weecloud require('./weecloud.js')

module.exports express.createServer(),
app module.exports

io require('socket.io').listen(app)
port or(process.env.PORT 5000)
refs {}

io.set('log level' 1)

app.configure((
    app.set('view options' {
        layout false
    })
    app.set('views' str(__dirname '/views')
    app.set('view engine' 'jade')
    app.use(express.bodyParser())
    app.use(app.router)
    app.use(express.static(str(__dirname '/public'))
))

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production' (
    app.use(express.errorHandler())
))

app.get('/' (req res (
    host req.socket.remoteAddress
    setif(host req.headers.x-forwarded-for)

    request.get({
        url 'https://api.github.com/repos/eirikb/weecloud/milestones'
        json true
    } fn(e r d (
        status if( and(!(e) >(0 d.length) )
                  Math.floor( *( /(d.0.closed_issues d.0.open_issues)))
                  0
                 )
        res.render('index' {
            status status
            host host
        })
    )))
))

fn(a b c +)

(+(a 2))
(a b c +(a b c))
(a b c (console.log(a b c) +(a b c)))

(+(1 2))
(a b c (+(a b c))
(a b c (console.log(a b c) +(a b c)))))
(a b c (+(a b c))
(a b c (console.log(a b c) +(a b c)))

({+(1 2)})
(a b c {+(a b c)})
(a b c {console.log(a b c) +(a b c)})


(a b c +(a b c))
{}
(+(1 2))
((+(1 2)))
(a (
    +(a 1)
))
(a {
    +(a 1)
})
(n {
    +(n 1)
})

array(1 2 3).map((m i (
    console.log(m)
    +(m i)
)))

app.get('/', function(req, res) {
    var host = req.socket.remoteAddress;
    if (req.headers['x-forwarded-for']) {
        host = req.headers['x-forwarded-for'];
    }

    request.get({
        url: 'https://api.github.com/repos/eirikb/weecloud/milestones',
        json: true
    },
    function(e, r, d) {
        var status, min, max;
        if (!e && d.length > 0) {
            min = d[0]['closed_issues'];
            max = d[0]['open_issues'];
            status = Math.floor((min / max) * 100);
        }
        res.render('index', {
            status: status,
            host: host
        });
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

