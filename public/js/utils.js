utils = {
  color: function(parts) {
    if (!parts) return '';

    return $.map(parts, function(part) {
      var $container = $('<div>');
      var linkExp = /((https?\:\/\/|www\.)\S+\.\S+)/ig;

      var fg = ('' + part.fg).replace(/ /, '');
      var bg = ('' + part.bg).replace(/ /, '');

      $part = $('<span>').css({
        'color': fg,
        'background-color': bg
      }).text(part.text);

      var html = $part.html();
      _.each(html.match(linkExp), function(link) {
        var original = link;
        if (link.match(/^www/i)) link = 'http://' + link;

        html = html.replace(original, '<a href="' + link + '" target="_blank">' + original + '</a>');
      });
      $part.html(html);

      return $container.append($part).html();
    }).join('');
  },
  onthumbnail: function() {
    var img = this;
    if (img.width > 300) {
      img.width = '300';
    }
  }
};

moment.fn.formatTimeToday = function() {
  var now = moment();
  var format = 'YYYY-MM-DD HH:mm:ss';
  if (this.date() === now.date() && Math.abs(this.diff(now)) < 86400000) {
    format = 'HH:mm:ss';
  }
  return this.format(format);
};
