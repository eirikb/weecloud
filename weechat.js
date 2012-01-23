var net = require('net');

var partial;
var total = 0;

var client = net.connect(8000, function() {
	console.log('client connected');
	client.write('init password=test,compression=off\n');
	//client.write('info version\n');
	//client.write('input irc.freenode.#testfrest hello guys!\n');
	//client.write('sync\n');
	//client.write('hdata buffer:gui_buffers(*) number,name\n');
	//client.write('hdata buffer:gui_buffers(*)/lines/first_line(*)/data\n');
	//client.write('input core.weechat /help filter\n');
	//client.write('hdata buffer *\n');
	client.write('hdata buffer:gui_buffers(*) number,name\n');
});

client.on('data', function(data) {
	var compress, idLength, id;

	if (total === 0) {
		total = getInt(data);
		compress = data[4];
		data = data.slice(5);
		idLength = getInt(data);
		id = data.slice(4, 4 + idLength);
		data = data.slice(4 + idLength);

		total -= (9 + idLength);

		partial = data;
	} else {
		partial += data;
	}

	if (partial.length >= total) {
		parse(partial);
		total = 0;
		partial = '';
	}
});

client.on('end', function() {
	console.log('client disconnected');
});

var hack = {
	hda: function(data) {
        var length = getInt(data);
        data = data.slice(4);
        var hpath = data.slice(0, length);
        data = data.slice(length);

        console.log(hpath.toString());
		console.log(data.toString());
        console.log(data)
	}
};

function parse(data) {
	var type = data.slice(0, 3);
	data = data.slice(3);

    console.log(type.toString());
	hack[type] && hack[type](data);
}

function getInt(array) {
	var l = ((array[0] & 0xff) << 24) | ((array[1] & 0xff) << 16) | ((array[2] & 0xff) << 8) | (array[3] & 0xff);
	return l > 0 ? l: 0;
}

