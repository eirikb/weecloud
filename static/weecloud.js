$(function() {
    var socket, current, $input = $('input'),
    $tabs = $('ul.tabs'),
    $tabsContent = $('ul.tabs-content'),
    buffer = [],
    bufferPos = 0;
    active = 'active',
    tabs = {};

    function append(key, line) {
        var $textarea = tabs[key];
        $textarea.val($textarea.val() + '\n' + line);
        $textarea.scrollTop($textarea.prop('scrollHeight'));
    }

    function addTab(key, name) {
        var $tab = $('<li>').append('<a href="#">' + name),
        $textarea = $('<textarea>'),
        $tabContent = $('<li>').append($textarea);

        tabs[key] = $textarea;

        $tabs.append($tab);
        $tabsContent.append($tabContent);

        $tab.click(function() {
            current = key;
            $tabs.find('a').removeClass(active);
            $tab.find('a').addClass(active);

            $tabsContent.children().removeClass(active);
            $tabContent.addClass(active);

            $textarea.scrollTop($textarea.prop('scrollHeight'));
            return false;
        }).click();
        $textarea.height(window.innerHeight - 150);
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
    socket.on('msg', function(msg) {
        append(msg.key, msg.from + ': ' + msg.msg);
    });

    socket.on('addBuffer', function(buffer) {
        addTab(buffer.key, buffer.name);
        $.each(buffer.lines, function(i, line) {
            append(buffer.key, line);
        });
    });
});

