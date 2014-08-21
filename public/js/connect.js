$(function() {
  socket.on('connect', function() {
    var $form = $('#connect');
    var $host = $('#host');
    var $port = $('#port');
    var $password = $('#password');
    var $ssl = $('#ssl');
    var $store = $('#store');
    var $thumbnail = $('#show_thumbnail');

    $('#connect, #connect-container').show();
    $('#center, #input, #top').hide();
    $('#loading').hide();

    if (window.localStorage && !$host.val()) {
      $host.val(localStorage.host);
      $port.val(localStorage.port);
      $password.val(localStorage.password);
      $ssl.prop('checked', localStorage.ssl === 'true');
      $store.prop('checked', localStorage.store === 'true');
      $thumbnail.prop('checked', localStorage.thumbnail === 'true');
    }

    $form.submit(function() {
      var host = $host.val();
      var port = $port.val();
      var password = $password.val();
      var ssl = $ssl.prop('checked');
      var store = $store.prop('checked');
      var thumbnail = $thumbnail.prop('checked');

      $('#error').hide();

      localStorage.host = store ? host : '';
      localStorage.port = store ? port : '';
      localStorage.password = store ? password : '';
      localStorage.ssl = store ? ssl : false;
      localStorage.store = store;
      localStorage.thumbnail = thumbnail;

      socket.emit('connect', {
        host: host,
        port: port,
        ssl: ssl,
        password: password
      }, function(version) {
        _gaq.push(['_setCustomVar', 1, 'WeeChat version', version]);
        _gaq.push(['_trackEvent', 'WeeChat', 'WeeChat version']);

        $('#connect').hide();
        $('#center, #input, #top').show();

        socket.emit('init');
      });

      return false;
    });
  });
});
