exports.index = function(req, res) {
    res.render('index', {
        title: 'Express',
        host: req.socket.remoteAddress
    })
};

