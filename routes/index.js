exports.index = function(req, res) {
    res.render('index', {
        host: req.socket.remoteAddress
    })
};

