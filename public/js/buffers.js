weecloud.buffers = (function() {
    var current, $deckCenter, $tabs, $tabsContent, buffers = {},
    active = 'active',
    kibo = new Kibo();

    kibo.down('alt a', function() {
        $tabs.find('a').filter(function() {
            return $(this).text().match(/\(\d+\)/);
        }).first().click();
    });

    $(function() {
        $tabs = $('.nav');
        $tabsContent = $('.tab-content');
        $deckCenter = $('.deck.center');
    });

    function addBuffer(buffer) {
        var $buffer, $tabContent, $a = $('<a href="#">').text(buffer.name),
        $counter = $('<span>'),
        $tab = $('<li>').append($a.append($counter));

        $.each(buffers, function(id, b) {
            if (b.number === buffer.number) {
                $buffer = buffers[id].$buffer;
                $tabContent = $buffer.parent();
            }
        });

        if (!$buffer) {
            $buffer = $('<div class="buffer">');
            $tabContent = $('<div class="tab-pane">').append($buffer);
            $tabs.append($tab);
            $tabsContent.append($tabContent);
        }

        buffer.$buffer = $buffer;
        buffer.$counter = $counter;
        buffer.$a = $a;
        buffers[buffer.id] = buffer;

        buffer.unread = 0;

        $tab.click(function() {
            var $b, $h;
            if (current) {
                $b = buffers[current].$buffer;
                $h = $b.find('hr');
                if ($h.size() === 0) {
                    $b.append('<hr>');
                } else {
                    $h.remove();
                }
            }

            if (buffer.unread === 0) {
                $buffer.find('hr').remove();
            }

            current = buffer.id;
            buffer.unread = 0;
            $counter.text('').css('color', '');

            $tabs.find('li').removeClass(active);
            $tab.addClass(active);
            $tab.children('a').removeClass();

            $tabsContent.children().removeClass(active);
            $tabContent.addClass(active);

            $deckCenter.scrollTop($buffer.prop('scrollHeight'));
            if ($(window).width() > 1000) {
                weecloud.input.focus();
            }
            return false;
        }).click();

        if (buffer.lines) {
            $.each(buffer.lines, function(i, line) {
                append(buffer.id, line.date, parseParts(line.prefix), parseParts(line.message), false);
            });
        }
    }

    function parseParts(parts) {
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

    function buildDate(date) {
        date = parseInt(date, 10) * 1000;
        if (!isNaN(date)) {
            date = new Date(date);
            return $.map([date.getHours(), date.getMinutes(), date.getSeconds()], function(t) {
                return t < 10 ? '0' + t: t
            }).join(':') + ' ';
        }
        return false;

    }

    function append(id, date, from, message, incCounter) {
        var $from, $a, $buffer, buffer = buffers[id],
        $line = $('<p>');

        if (buffer && buffer.$buffer) {
            if (!incCounter) $line.css('opacity', 0.5);
            $buffer = buffer.$buffer;

            date = buildDate(date);
            if (date) $line.append(date);

            $from = $(from);
            $from.last().click(function() {
                weecloud.input.setNick($(this).text());
            });

            $line.append($from).append(': ').append(message);
            $buffer.append($line);

            if (message.match(buffer.nick)) {
                $line.css('background-color', '#402020');
            }

            if ($buffer.is(':visible')) $deckCenter.scrollTop($buffer.prop('scrollHeight'));
            if (!$buffer.is(':visible') && incCounter) {
                $a = buffer.$a;
                if (!$a.hasClass('label')) $a.addClass('label label-info');
                buffer.unread++;
                buffer.$counter.text('(' + buffer.unread + ')');
                if (message.match(buffer.nick)) {
                    buffer.$counter.css('color', 'red');
                    $a.removeClass('label-info').addClass('label-important');
                }
            }
        }
    }

    function clear() {
        buffers = {};
        $tabs.empty();
        $tabsContent.empty();
    }

    function msg(m) {
        var from = parseParts(m.from),
        message = parseParts(m.message),
        incCounter = false;

        if (from) incCounter = ! from.match(/--/);
        append(m.bufferid, m.date, from, message, incCounter);
    }

    return {
        addBuffer: addBuffer,
        append: append,
        clear: clear,
        msg: msg,
        current: function() {
            return current;
        }
    };
})();

