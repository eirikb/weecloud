wc.date = (function() {
    var self = {};

    self.build = function(date) {
        date = parseInt(date, 10) * 1000;
        if (!isNaN(date)) {
            date = new Date(date);
            return $.map([date.getHours(), date.getMinutes(), date.getSeconds()], function(t) {
                return t < 10 ? '0' + t: t;
            }).join(':') + ' ';
        }
        return false;
    };

    return self;
})();

