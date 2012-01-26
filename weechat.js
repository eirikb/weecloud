var net = require('net');

var data, client, partial, obj, total = 0,
id = 0,
callbacks = {},
listeners = {},
self = this,
types = {
    chr: getChar,
    int: getInt,
    // hacks
    lon: getPointer,
    str: getString,
    buf: getBuffer,
    ptr: getPointer,
    // hacks
    tim: getPointer,
    htb: getHashtable,
    hda: getHdata,
    inf: getInfo,
    inl: getInfolist
};

exports.connect = function(port, password, cb) {
    client = net.connect(port, function() {
        var connected = true;
        self.write('init password=' + password + ',compression=off');
        // Ping test password 
        self.write('info version');
        client.on('end', function() {
            connected = false;
        });
        setTimeout(function() {
            if (connected) {
                client.on('data', onData);
            }
            if (cb) {
                cb(connected);
            }
        },
        100);
    });
};

exports.write = function(msg, cb) {
    id++;
    callbacks[id] = cb;
    client.write('(' + id + ') ' + msg + '\n');
};

exports.on = function(listener, cb) {
    if (arguments.length === 1) {
        cb = listener;
        listener = '*';
    }
    if (!listeners[listener]) {
        listeners[listener] = [];
    }
    listeners[listener].push(cb);
};

// Helper
function loop(range, cb) {
    var i;
    for (i = 0; i < range; i++) {
        cb(i);
    }
}

function onData(part) {
    var tmpBuf, ret, cb;
    data = part;

    if (total === 0) {
        obj = {};
        total = getInt();
        obj.compress = getCompression();
        obj.id = getString();

        // 9 is number of bytes already read
        total -= (9 + obj.id.length);
        partial = data;
    } else {
        tmpBuf = new Buffer(partial.length + data.length);
        partial.copy(tmpBuf);
        data.copy(tmpBuf, partial.length);
        partial = tmpBuf;
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
        } [obj.id, '*'].forEach(function(l) {
            if (listeners[l]) {
                listeners[l].forEach(function(cb) {
                    cb(obj);
                });
            }
        });
    }
}

function parse() {
    var type;
    if (data.length < 3) {
        return null;
    }
    return runType(getType());
}

function runType(type) {
    if (types[type]) {
        return types[type]();
    } else {
        throw 'Unkown type: ' + type;
    }
}

function getCompression() {
    var c = data[0];
    data = data.slice(1);
    return c;
}

function getChar() {
    var c = data[0];
    data = data.slice(1);
    return c;
}

function getInt() {
    var i = ((data[0] & 0xff) << 24) | ((data[1] & 0xff) << 16) | ((data[2] & 0xff) << 8) | (data[3] & 0xff);
    data = data.slice(4);
    return i >= 0 ? i: null;
}

function getString() {
    var l = getInt(),
    s = data.slice(0, l);
    data = data.slice(l);
    return s.toString();
}

function getBuffer() {
    throw 'Type not implemented: Buffer';
}

function getPointer() {
    var l = data[0],
    pointer = data.slice(1, l + 1);
    data = data.slice(l + 1);
    return pointer;
}

function getHashtable() {
    var i, typeKeys = getType(),
    typeValues = getType(),
    count = getInt(),
    obj = {};
    loop(count, function() {
        obj[types[typeKeys]()] = runType(typeValues);
    });
    return obj;
}

function getHdata() {
    var keys, objs = [];

    obj.hpath = getString();
    keys = getString().split(',');
    obj.count = getInt();

    keys = keys.map(function(key) {
        return key.split(':');
    });

    loop(obj.count, function() {
        var tmp = {
            pointers: []
        };
        loop(obj.hpath.split('/').length, function() {
            tmp.pointers.push(getPointer());
        });
        keys.forEach(function(key) {
            tmp[key[0]] = runType(key[1]);
        });
        objs.push(tmp);
    });
    obj.objects = objs;
    return obj;
}

function getInfo() {
    return {
        name: getString(),
        content: getString()
    };
}

function getType() {
    var t = data.slice(0, 3);
    data = data.slice(3);
    return t;
}

function getInfolist() {
    throw 'Type not implemented: infolist';
}

