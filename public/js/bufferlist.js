wc.bufferlist = (function() {
    var self = {};

    var $container;
    var containerId = '#bufferlist';
    var groups = {};
    var $buffers = {};

    $(function() {
        var width;

        $container = $(containerId);
        width = $container.width();

        $('select').change(function() {
            $(this).find(':selected').each(function() {
                $(this).data('ref').click();
            });
        });
    });

    kibo.down('alt a', function() {
        var $buffer = $('#bufferlist a').sort(function(a, b) {
            return $(b).data('count') - $(a).data('count');
        }).first();
        if ($buffer.data('count') <= 0) return;
        $buffer.click();
    });
    _.each(_.range(1, 10), function(i) {
        kibo.down('alt ' + i, function() {
            var $buffer = $buffers[i];
            if (!$buffer) return;
            $buffer.click();
            return false;
        });
    });
    var esc = 0;
    kibo.down('any', function() {
        if (esc < 0) return;
        esc--;
    });
    kibo.down('esc', function() {
        esc = 2;
    });
    _.each(_.range(1, 10), function(i) {
        kibo.down('' + i, function() {
            if (esc <= 0) return;
            var $buffer = $buffers[i];
            if (!$buffer) return;
            $buffer.click();
            return false;
        });
    });

    function setActive($buffer) {
        // Remove active from every active buffer
        $container.find('.active').removeClass('active');
        $buffer.addClass('active');
        $buffer.data('count', 0);
        updateCount($buffer);
        $current = $buffer;
        $('#footer input').focus();
    }

    function updateCount($buffer) {
        var count = $buffer.data('count');
        var $counter = $buffer.find('span');

        if (count <= 0) $counter.hide().text('');
        else $counter.show().text('(' + count + ')');

        $buffer.data('ref').text($buffer.text());
    }

    function getOrSetGroup(name) {
        var $group = groups[name];
        if ($group) return $group.find('ul');

        $group = $('<li>').attr('id', 'group-' + name);
        groups[name] = $group;

        var $button = $('<button>').addClass('btn btn-mini').text(name);
        $button.click(function() {
            $group.children('ul').slideToggle();
        });
        $group.append($button);
        $group.append($('<ul>').addClass('nav'));
        $container.children('ul').append($group);
        return $group.find('ul');
    }

    wc.socket.on('buffer', function(buffer) {
        var group, channel, $group, $buffer = $('<a>');
        var $sBuffer = $('<option>').text(buffer.name);
        $buffers[buffer.number] = $buffer;

        if (buffer.channel) {
            group = buffer.name.replace(buffer.channel, '').slice(0, -1);
            channel = buffer.channel;
        } else {
            group = 'default';
            channel = buffer.name;
        }

        $buffer.text(channel);

        $group = getOrSetGroup(group);
        if (group === 'default' || group === 'server') $group.slideUp(0);

        // For update counting
        $buffer.append('<span>');

        $buffer.attr('id', 'bufferlist-' + buffer.id);
        $buffer.data('ref', $sBuffer);
        $sBuffer.data('ref', $buffer);
        $sBuffer.val(buffer.id);

        $buffer.click(function() {
            setActive($buffer);
            wc.buffers.show(buffer.id);
            $('select').val(buffer.id);
            if ($('#syncmovement').is(':checked')) {
                wc.socket.emit('msg', {
                    id: wc.buffers.current,
                    line: '/buffer ' + buffer.channel
                });
            }
        });

        setActive($buffer);

        $group.append($('<li>').append($buffer));
        $('select').append($sBuffer);
    });

    wc.socket.on('disconnect', function() {
        $container.empty();
    });

    wc.socket.on('msg', function(msg) {
        var $buffer = $container.find('#bufferlist-' + msg.bufferid);
        var count = $buffer.data('count');

        // Checks if the msg is a real message and not a status (quit/join)
        // Didn't see any other soltuion at the moment
        if (!wc.color.parse(msg.from).match(/--/)) {
            if ($buffer.attr('id') !== $current.attr('id')) {
                count++;
                $buffer.data('count', count);
                updateCount($buffer);
            }
        }
    });

    return self;
})();
