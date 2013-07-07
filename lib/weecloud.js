var weechat = require('weechat');
var util = require('util');

var buffers = 'hdata buffer:%s number,short_name,title,local_variables';
var lines = 'hdata buffer:%s/own_lines/last_line(-%d)/data';

function getBuffer(buffer) {
  if (buffer && buffer.pointers) {
    var lc = buffer.local_variables;

    var title = lc.channel;
    var server = lc.server;

    if (!title) title = lc.plugin;
    if (!server) server = 'weechat';

    return {
      id: buffer.pointers[0],
      nick: buffer.nick,
      server: server,
      title: title,
      number: buffer.number,
      type: lc.type
    };
  } else {
    console.error('Buffer has no pointers: ', buffer);
    return null;
  }
}

function getMessage(line) {
  if (typeof line.displayed !== 'undefined' && !line.displayed) return;

  var date = new Date(parseInt(line.date, 10) * 1000);
  var type = 'message';
  var tags = line.tags_array;
  if (!Array.isArray(tags)) tags = [];

  ['join', 'part', 'quit', 'nick'].forEach(function(t) {
    if (tags.indexOf('irc_' + t) >= 0) type = t;
  });

  var nick = tags.map(function(tag) {
    var n = tag.match(/^nick_(\S+)/i);
    return n && n.length >= 2 ? n[1] : null;
  }).filter(function(nick) {
    return nick;
  });
  nick = nick.length > 0 ? nick[0] : null;
  var user = getUser(line.buffer, nick);

  return {
    bufferid: line.buffer,
    from: weechat.style(line.prefix),
    date: date,
    type: type,
    user: user,
    highlight: !! line.highlight,
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
  var client = weechat.connect(data.host, data.port, data.password, data.ssl, function() {
    client.send('info version', function(version) {
      console.log(data.host, data.port, version.value);
    });

    cb();
  });

  client.on('error', function(err) {
    if (!err.code) err = err.toString();
    else if (err.code === 'ENOTFOUND') err = 'Host not found';
    else err = 'Unkown error';

    err = err.replace(/error:/i, '');
    socket.emit('error', err);
  });

  client.on('open', function(buffer) {
    var bufferid = buffer.pointers[0];
    queryAndEmitBuffers(bufferid);
  });

  client.on('close', function(buffer) {
    socket.emit('close:buffer', buffer.buffer);
  });

  client.on('line', function(lines) {
    if (!Array.isArray(lines)) lines = [lines];
    lines.reverse().forEach(function(line) {
      var message = getMessage(line);
      if (!message) return;

      socket.emit('message', message);
    });
  });

  socket.on('init', function() {
    queryAndEmitBuffers();
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
      if (!Array.isArray(lines)) lines = [lines];
      var messages = lines.reverse().map(getMessage).filter(function(message) {
        return message;
      });
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

  socket.on('open', function(buffer, number) {
    client.send('input ' + buffer + ' /buffer ' + number);
  });

  function queryAndEmitBuffers(buffer) {
    if (!buffer) buffer = 'gui_buffers(*)';
    var query = util.format(buffers, buffer);

    client.send(query, function(buffers) {
      if (!Array.isArray(buffers)) buffers = [buffers];

      buffers.forEach(function(buffer) {
        buffer = getBuffer(buffer);
        if (!buffer) return;

        socket.emit('open:buffer', buffer);
      });
    });
  }
};
