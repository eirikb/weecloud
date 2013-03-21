var weechat = require('weechat');
var util = require('util');

var buffers = 'hdata buffer:gui_buffers(*) number,short_name,title,local_variables';
var lines = 'hdata buffer:%s/own_lines/last_line(-%d)/data';

exports.init = function(socket, data) {

  var client = weechat.connect(data.host, data.port, data.password, function(err) {

    if (err) {
      socket.emit('error', err);
      return;
    }

    function getBuffer(buffer) {
      if (buffer && buffer.pointers) {
        buffer.id = buffer.pointers[0];
        return buffer;
        emit('buffer', buffer);
      } else {
        console.error('Buffer has no pointers: ', buffer);
        return null;
      }
    }

    function getLine(line) {
      return {
        bufferid: line.buffer,
        from: weechat.style(line.prefix),
        date: line.date,
        message: getMessage(line.message)
      };
    }

    function getMessage(message) {
      message = weechat.style(message).map(function(part) {
        return part;
      });
      return message;
    }

    client.on('open', function(buffers) {
      buffers.forEach(function(buffer) {
        buffer = getBuffer(buffer);
        if (buffer) socket.emit('buffer', buffer);
      });
    });

    client.on('close', function(buffers) {
      buffers.forEach(function(buffer) {
        emit('closeBuffer', buffer.buffer);
      });
    });

    client.on('line', function(lines) {
      if (!Array.isArray(lines)) lines = [lines];
      lines.forEach(function(line) {
        socket.emit('line', getLine(line));
      });
    });

    socket.on('msg', function(msg) {
      client.write('input ' + msg.id + ' ' + msg.line);
    });

    socket.emit('auth', true);
    socket.emit('synced', 'done');

    client.send(buffers, function(buffers) {
      buffers.forEach(function(buffer) {
        buffer.id = buffer.pointers[0];
        var query = util.format(lines, buffer.id, 20);

        client.send(query, function(lines) {
          buffer = getBuffer(buffer);
          buffer.lines = lines.map(getLine);
          socket.emit('buffer', buffer);
        });
      });
    });
    return;
  });
};
