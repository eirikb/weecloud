$(function() {
  socket.on('connect', function() {
    var $form = $('#connect');
    var $host = $('#host');
    var $port = $('#port');
    var $password = $('#password');
    var $store = $('#store');

    $('#connect, #connect-container').show();
    $('#center, #input, #top').hide();
    $('#loading').hide();

    if (window.localStorage) {
      $host.val(localStorage.host);
      $port.val(localStorage.port);
      $password.val(localStorage.password);
      $store.prop('checked', localStorage.store);
    }

    $form.submit(function() {
      var host = $host.val();
      var port = $port.val();
      var password = $password.val();
      var store = $store.prop('checked');

      $('#error').hide();

      localStorage.host = store ? host : '';
      localStorage.port = store ? port : '';
      localStorage.password = store ? password : '';
      localStorage.store = store;

      socket.emit('connect', {
        host: host,
        port: port,
        password: password
      }, function(data) {
        $('#connect').hide();
        $('#center, #input, #top').show();

        socket.emit('init');
      });

      return false;
    });
  });
});
