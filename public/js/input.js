weecloud.input = (function() {
    var $input;

    $(function() {
        var history = [],
        historyPos = 0;

        $input = $('input');

        $input.keydown(function(e) {
            var line, currentPos = historyPos;
            switch (e.keyCode) {
            case 13:
                line = $input.val();
                if (line.length > 0) {
                    $input.val('');
                    history.push(line);
                    historyPos = history.length;
                    weecloud.main.msg(line);
                }
                return false;
            case 38:
                historyPos--;
                break;
            case 40:
                historyPos++;
                break;
            }
            if (historyPos < 0) {
                historyPos = 0;
            } else if (historyPos > history.length) {
                historyPos = history.length;
            }

            if (currentPos !== historyPos) {
                $input.val(history[historyPos]);
                return false;
            }
        });
    });

    function focus() {
        $input.focus();
    }

    function setNick(nick) {
        var v = $input.val();
        $input.val(nick + ': ' + v.slice(v.indexOf(':') + 1));
        $input.focus();
    }

    return {
        focus: focus,
        setNick: setNick
    };
})();

