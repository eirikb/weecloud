var weechat = require('../../weechat.js/src/weechat');
//var weechat = require('weechat');
var util = require('util');

var buffers = 'hdata buffer:gui_buffers(*) number,short_name,title,local_variables';
var lines = 'hdata buffer:%s/own_lines/last_line(-%d)/data';


function getBuffer(buffer) {
  if (buffer && buffer.pointers) {
    var lc = buffer['local_variables'];
    if (!lc || lc.type !== 'channel') return;
    return {
      id: buffer.pointers[0],
      server: lc.server,
      title: lc.channel
    }
  } else {
    console.error('Buffer has no pointers: ', buffer);
    return null;
  }
}

function getMessage(line) {
  return {
    bufferid: line.buffer,
    from: weechat.style(line.prefix),
    date: line.date,
    message: messageParts(line.message)
  };
}

function messageParts(line) {
  return weechat.style(line).map(function(part) {
    return part;
  });
}

exports.connect = function(socket, data, cb) {
  var client = weechat.connect(data.host, data.port, data.password, function() {
    cb();
  });

  client.on('error', function(err) {
    socket.emit('error', err);
  });

  client.on('open', function(buffers) {
    buffers.forEach(function(buffer) {
      buffer = getBuffer(buffer);
      if (buffer) socket.emit('open:buffer', buffer);
    });
  });

  client.on('close', function(buffers) {
    buffers.forEach(function(buffer) {
      socket.emit('close:buffer', buffer.buffer);
    });
  });

  client.on('line', function(lines) {
    if (!Array.isArray(lines)) lines = [lines];
    lines.forEach(function(line) {
      socket.emit('message', getMessage(line));
    });
  });

  socket.on('init', function() {
    client.send(buffers, function(buffers) {
      buffers.forEach(function(buffer) {
        buffer.id = buffer.pointers[0];
        var query = util.format(lines, buffer.id, 20);

        client.send(query, function(lines) {
          buffer = getBuffer(buffer);
          if (!buffer) return;
          socket.emit('open:buffer', buffer);
        });
      });
    });
  });

  socket.on('msg', function(msg) {
    client.write('input ' + msg.id + ' ' + msg.line);
  });

  socket.on('disconnect', function() {
    client.disconnect();
  });

  socket.on('get:messages', function(bufferid, count, cb) {
    var query = util.format(lines, bufferid, count);
    client.send(query, function(lines) {
      var messages = lines.map(getMessage);
      cb(messages);
    });
  });
};
