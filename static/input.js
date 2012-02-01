weecloud.input = (function() {
    var $input;

    $(function() {
        $input = $('input'),
        buffer = [],
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
                    weecloud.main.msg(line);
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

    function focus() {
        $input.focus();
    }

    return {
        focus: focus
    };
})();

