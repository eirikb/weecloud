exports.index = function(req, res) {
    res.render('index', {
        host: req.socket.remoteAddress
    })
};

exports.relay = function(req, res) {
    res.render('relay', {
        host: req.socket.remoteAddress
    })
};

