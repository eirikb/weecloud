weecloud.buffers = (function() {
    var current, $tabs, $tabsContent, buffers = {},
    active = 'active';

    $(function() {
        $tabs = $('.nav-tabs');
        $tabsContent = $('.tab-content');

        $(window).resize(function() {
            $tabsContent.height(window.innerHeight - 90);
        }).resize();
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
        buffers[buffer.id] = buffer;

        buffer.unread = 0;

        $tab.click(function() {
            current = buffer.id;
            buffer.unread = 0;
            $counter.text('');

            $tabs.find('li').removeClass(active);
            $tab.addClass(active);

            $tabsContent.children().removeClass(active);
            $tabContent.addClass(active);

            $buffer.scrollTop($buffer.prop('scrollHeight'));
            weecloud.input.focus();
            return false;
        }).click();

        if (buffer.lines) {
            $.each(buffer.lines, function(i, line) {
                append(buffer.id, parseParts(line.prefx) + parseParts(line.message));
            });
        }

        $(window).resize(function() {
            $buffer.scrollTop($buffer.prop('scrollHeight'));
        });
    }

    function parseParts(parts) {
        if (!parts) {
            return '';
        }
        return $.map(parts, function(part) {
            var $container = $('<div>'),
            $part = $('<span>').css('color', part.color).text(part.part);
            return $container.append($part).html();
        }).join();
    }

    function append(id, line) {
        var $buffer, buffer = buffers[id],
        $line = $('<p>').append(line);

        if (buffer && buffer.$buffer) {
            $buffer = buffer.$buffer;

            buffer.$buffer.append($line);
            buffer.$buffer.scrollTop(buffer.$buffer.prop('scrollHeight'));
            if (!$buffer.is(':visible')) {
                buffer.unread++;
                buffer.$counter.text('(' + buffer.unread + ')');
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
        message = parsePart(m.message);

        weecloud.buffers.append(m.bufferid, from + ': ' + message);
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

