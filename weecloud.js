var net = require('net');
var client = net.connect(8000, function() { 
	client.write('init password=test,compression=off\n');
	client.write('info version\n');
});
client.on('data', function(data) {
	console.log(data.toString());
	client.end();
});
client.on('end', function() {
	console.log('client disconnected');
});

