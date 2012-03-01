$(function() {
    var connections = getConnections(),
    $remembered = $('tbody');

    if (connections.length > 0) $('#history').show();

    $('[rel=popover]').popover();

    $('#insert-ip').click(function() {
        var $host = $('[name=host]');

        $host.val($host.data('host'));
        return false;
    });

    $('button:submit').click(function() {
        var c, names = ['host', 'port', 'password'];

        if ($(':checkbox').is(':checked')) {
            connection = {};
            $.each(names, function(i, name) {
                connection[name] = $('[name=' + name + ']').val();
            });
            connections.push(connection);
            localStorage.connections = JSON.stringify(connections);
        }
    });

    $.each(connections, function(i, connection) {
        var $tr = $('<tr>'),
        $btn = $('<button>').addClass('btn');

        $btn.text('Connect');
        $btn.click(function() {
            $.each(connection, function(name, val) {
                $('[name=' + name + ']').val(val);
            });
            $('button:submit').click();
        });

        $tr.append('<td>' + connection.host);
        $tr.append('<td>' + connection.port);
        $tr.append($('<td>').append($btn));

        $remembered.append($tr);
    });

    function getConnections() {
        try {
            return JSON.parse(localStorage.connections);
        } catch(e) {}
        return [];
    }
});

