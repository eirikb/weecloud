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

      $part.html($part.html().replace(linkExp, '<a href="$1">$1</a>'));

      return $container.append($part).html();
    }).join('');
  }
};

moment.fn.formatTimeToday = function() {
  var now = moment();
  var format = 'YYYY-MM-DD HH:mm:ss';
  if (this.date() === now.date() && Math.abs(this.diff(now)) < 86400000) {
    format = 'HH:mm:ss';
  }
  return this.format(format);
}
