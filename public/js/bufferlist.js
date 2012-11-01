wc.bufferlist = (function() {
    var self = {};

    var $container;
    var containerId = '#bufferlist';
    var groups = {};

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

    function setActive($buffer) {
        // Remove active from every active buffer
        $container.find('.active').removeClass('active');
        $buffer.addClass('active');
        $buffer.data('count', 0);
        updateCount($buffer);
        $current = $buffer;
    }

    function updateCount($buffer) {
        var count = $buffer.data('count'),
            $counter = $buffer.find('span');

        if (count <= 0) $counter.hide();
        else $counter.show().text('(' + count + ')');
    }

    function getOrSetGroup(name) {
        var $group = groups[name];
        if ($group) return $group.find('ul');

        $group = $('<li>').attr('id', 'group-' + name).slideUp(0);
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
        var group, channel, $group, $buffer = $('<a>'),
            $sBuffer = $('<option>').text(buffer.name);

        if (buffer.channel) {
            group = buffer.name.replace(buffer.channel, '').slice(0, -1);
            channel = buffer.channel;
        } else {
            group = 'default';
            channel = buffer.name;
        }

        $buffer.text(channel);

        $group = getOrSetGroup(group);

        // For update counting
        $buffer.append('<span>');

        $buffer.attr('id', 'bufferlist-' + buffer.id);
        $sBuffer.data('ref', $buffer);
        $sBuffer.val(buffer.id);

        $buffer.click(function() {
            setActive($buffer);
            wc.buffers.show(buffer.id);
            $('select').val(buffer.id);
        });

        setActive($buffer);

        $group.append($('<li>').append($buffer));
        $('select').append($sBuffer);
    });

    wc.socket.on('disconnect', function() {
        $container.empty();
    });

    wc.socket.on('msg', function(msg) {
        var $buffer = $container.find('#bufferlist-' + msg.bufferid),
            count = $buffer.data('count');

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
