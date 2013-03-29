$(function() {
  socket.on('connect', function() {
    $('.modal').modal();
    var $host = $('#host');
    var $port = $('#port');
    var $password = $('#password');
    var $store = $('#store');

    if (window.localStorage) {
      $host.val(localStorage.host);
      $port.val(localStorage.port);
      $password.val(localStorage.password);
      $store.prop('checked', localStorage.store);
    }

    $('.modal .btn').click(function() {
      var host = $host.val();
      var port = $port.val();
      var password = $password.val();
      var store = $store.prop('checked');

      localStorage.host = store ? host : '';
      localStorage.port = store ? port : '';
      localStorage.password = store ? password : '';
      localStorage.store = store;

      socket.emit('connect', {
        host: host,
        port: port,
        password: password
      }, function(data) {
        $('.modal').modal('hide');

        socket.emit('init');
      });
    });

    $host.keydown(function(e) {
      if (e.keyCode === 13) $('.modal .btn').click();
    });
  });
});
