weecloud.color = (function() {

    var parseParts = function(parts) {
        if (!parts) {
            return '';
        }
        return $.map(parts, function(part) {
            var links, $part, $container = $('<div>'),
            linkRegex = /(https?\:\/\/|www\.)\S+\.\S+/g,
            fg = part.fg ? part.fg.split(' ').join('').toLowerCase() : '',
            bg = part.bg ? part.bg.split(' ').join('').toLowerCase() : '';

            links = part.text.match(linkRegex);
            if (links) {
                $.each(links, function(i, link) {
                    part.text = part.text.replace(link, '<a href="' + link + '" target="_blank">' + link + '</a>');
                });
            }

            $part = $('<span>').css({
                'color': fg,
                'background-color': bg
            }).append(part.text);
            if (fg.match(/dark/i)) {
                $part.css('color', changeColor.lighter($part.css('color'), 0.5));
            }
            return $container.append($part).html();
        }).join('');
    }

    return parseParts;
})();

