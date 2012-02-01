weecloud.input = (function() {
    var buffer = [],
    bufferPos = 0;

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
});

