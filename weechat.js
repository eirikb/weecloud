var net = require('net');

var data, client, partial, obj, total = 0,
id = 0,
callbacks = {},
self = this;

exports.connect = function(port, password, cb) {
	client = net.connect(port, function() {
		init();
		self.write('init password=' + password + ',compression=off', cb);
        cb();
	});
};

exports.write = function(msg, cb) {
	id++;
	callbacks[id] = cb;
	client.write('(' + id + ') ' + msg + '\n');
};

exports.version = function(cb) {
    self.write('info version', cb);
}

exports.nicklist = function(cb) {
    
};

function init() {
	client.on('data', function(part) {
		var ret, cb;
		data = part;

		if (total === 0) {
			obj = {};
			total = getInt();
			obj.compress = getCompression();
			obj.id = getString();

			total -= (9 + obj.id.length);
			partial = data;
		} else {
			partial += data;
		}

		if (partial.length >= total) {
			data = partial;
			total = 0;
			partial = '';
			ret = parse();
			cb = callbacks[obj.id];
			if (cb) {
				cb(obj);
				delete callbacks[obj.id];
			}
		}
	});
}

var hack = {
	hda: getHdata,
	str: getString,
	int: getInt,
	inf: getInf,
	ptr: getPointer,
	tim: getPointer,
	chr: getChar
};

function parse() {
	var type;

	if (data.length < 3) {
		return null;
	}

	type = data.slice(0, 3);
	data = data.slice(3);

	return hack[type] && hack[type]();
}

function getCompression() {
	var c = data[0];
	data = data.slice(1);
	return c;
}

function getInt() {
	var i = ((data[0] & 0xff) << 24) | ((data[1] & 0xff) << 16) | ((data[2] & 0xff) << 8) | (data[3] & 0xff);
	data = data.slice(4);
	return i > 0 ? i: null;
}

function getString() {
	var l = getInt(),
	s = data.slice(0, l);
	data = data.slice(l);
	return s.toString();
}

function getPointer() {
	var l = data[0],
	pointer = data.slice(1, l + 1);
	data = data.slice(l + 1);
	return pointer;
}

function getHdata() {
	var i, p, tmp, keys, objs = [];

	obj.hpath = getString();
	keys = getString().split(',');
	obj.count = getInt();

	keys = keys.map(function(key) {
		return key.split(':');
	});

	for (i = 0; i < obj.count; i++) {
		tmp = {
			pointers: []
		};
		for (p = 0; p < obj.hpath.split('/').length; p++) {
			tmp.pointers.push(getPointer());
		}
		keys.forEach(function(key) {
			var type = hack[key[1]];
			if (type) {
				tmp[key[0]] = hack[key[1]]();
			}
		});
		objs.push(tmp);
	}
	obj.objects = objs;
	return obj;
}

function getInf() {
	return {
		name: getString(),
		content: getString()
	};
}

function getChar() {
	var c = data[0];
	data = data.slice(1);
	return c;
}

