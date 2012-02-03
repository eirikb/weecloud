weecloud.lobby = (function() {
    $(function() {
        $('#insert-ip').click(function() {
            var $host = $('[name=host]');

            $host.val($host.data('host'));
        });
    });
})();

