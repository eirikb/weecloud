$(function() {
    var socket, current, $input = $('input'),
    $tabs = $('ul.tabs'),
    $tabsContent = $('ul.tabs-content'),
    $status = $('#status'),
    buffers = {},
    buffer = [],
    bufferPos = 0;
    active = 'active';

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

    function addTab(buffer) {
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
            $buffer = $('<div class="buffer">'),
            $tabContent = $('<li>').append($buffer);
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

            $tabs.find('a').removeClass(active);
            $tab.find('a').addClass(active);

            $tabsContent.children().removeClass(active);
            $tabContent.addClass(active);

            $buffer.scrollTop($buffer.prop('scrollHeight'));
            $input.focus();
            return false;
        }).click();

        $(window).resize(function() {
            $buffer.scrollTop($buffer.prop('scrollHeight'));
        });
    }

    $input.keydown(function(e) {
        var line, currentPos = bufferPos;
        switch (e.keyCode) {
        case 13:
            line = $input.val();
            if (line.length > 0) {
                $input.val('');
                buffer.push(line);
                bufferPos = buffer.length;
                socket.emit('msg', {
                    id: current,
                    line: line
                });
            }
            return false;
        case 38:
            bufferPos--;
            break;
        case 40:
            bufferPos++;
            break;
        }
        if (bufferPos < 0) {
            bufferPos = 0;
        } else if (bufferPos > buffer.length) {
            bufferPos = buffer.length;
        }

        if (currentPos !== bufferPos) {
            $input.val(buffer[bufferPos]);
            return false;
        }
    });

    socket = io.connect();

    socket.on('connect', function() {
        buffers = {};
        $tabs.empty();
        $tabsContent.empty();
        $status.hide();
    });

    socket.on('disconnect', function() {
        $tabs.empty();
        $tabsContent.empty();
        $status.show();
    });

    socket.on('msg', function(msg) {
        append(msg.bufferid, parseParts(msg.from) + ': ' + parseParts(msg.message));
    });

    socket.on('addBuffer', function(buffer) {
        addTab(buffer);
        if (buffer.lines) {
            $.each(buffer.lines, function(i, line) {
                append(buffer.id, parseParts(line.prefx) + parseParts(line.message));
            });
        }
    });

    $(window).resize(function() {
        $tabsContent.height(window.innerHeight - 90);
    }).resize();
});

