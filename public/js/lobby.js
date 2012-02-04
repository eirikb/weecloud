weecloud.lobby = (function() {
    $(function() {
        $('[rel=popover]').popover();

        $('#insert-ip').click(function() {
            var $host = $('[name=host]');

            $host.val($host.data('host'));
        });
    });
})();

