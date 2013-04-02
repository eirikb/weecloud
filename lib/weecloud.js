var weechat = require('weechat');
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
  var date = new Date(parseInt(line.date, 10) * 1000);
  var type = 'message';
  var tags = line['tags_array'] || [];

  if (tags.indexOf('irc_join') >= 0) type = 'join';
  else if (tags.indexOf('irc_part') >= 0) type = 'part';

  var user;
  if (type !== 'message') {
    var r = /^nick_/i;
    user = tags.filter(function(tag) {
      return tag.match(r);
    })[0].replace(r, '');
  }

  return {
    bufferid: line.buffer,
    from: weechat.style(line.prefix),
    date: date,
    type: type,
    user: getUser(line.buffer, user),
    message: messageParts(line.message)
  };
}

function getUser(buffer, user) {
  return {
    title: user,
    id: buffer + '-' + user
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
    lines.reverse().forEach(function(line) {
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
      var messages = lines.reverse().map(getMessage);
      cb(messages);
    });
  });

  socket.on('get:users', function(bufferid, cb) {
    client.send('nicklist ' + bufferid, function(users) {
      if (!Array.isArray(users)) users = [users];

      users = users.filter(function(user) {
        return user.level <= 0 && user.visible;
      }).map(function(user) {
        return getUser(bufferid, user.name);
      });
      cb(users);
    });
  });

  socket.on('message', function(bufferid, message) {
    client.send('input ' + bufferid + ' ' + message);
  });
};
