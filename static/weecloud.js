$(function() {
    var socket, current, $input = $('input'),
    $tabs = $('ul.tabs'),
    $tabsContent = $('ul.tabs-content'),
    buffer = [],
    bufferPos = 0;
    active = 'active',
    buffers = {};

    function parseParts(parts) {
        return $.map(parts, function(part) {
            var $container = $('<div>'),
            $part = $('<span>').css('color', part.color).text(part.part);
            return $container.append($part).html();
        }).join();
    }

    function append(key, line) {
        var $buffer = buffers[key],
        $line = $('<p>').append(line);

        $buffer.append($line);
        $buffer.scrollTop($buffer.prop('scrollHeight'));
    }

    function addTab(key, name) {
        var $tab = $('<li>').append('<a href="#">' + name),
        $buffer = $('<div class="buffer">'),
        $tabContent = $('<li>').append($buffer);

        buffers[key] = $buffer;

        $tabs.append($tab);
        $tabsContent.append($tabContent);

        $tab.click(function() {
            current = key;
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
                    key: current,
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
    });
    socket.on('msg', function(msg) {
        append(msg.key, parseParts(msg.from) + ': ' + parseParts(msg.msg));
    });

    socket.on('addBuffer', function(buffer) {
        addTab(buffer.key, buffer.name);
        $.each(buffer.lines, function(i, parts) {
            append(buffer.key, parseParts(parts));
        });
    });

    $(window).resize(function() {
        $tabsContent.height(window.innerHeight - 90);
    }).resize();
});

