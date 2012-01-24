var weechat = require('./weechat.js');


weechat.connect(8000, 'test', function() {
    console.log('connected');

    weechat.version(function(obj) {
        console.log(obj);
    });
});


/*
client = net.connect(8000, function() {
	client.write('init password=test,compression=off\n');
	//client.write('info version\n');
	//client.write('input irc.freenode.#testfrest hello guys!\n');
	//client.write('sync\n');
	//client.write('hdata buffer:gui_buffers(*) number,name\n');
	//client.write('hdata buffer:gui_buffers(*)/lines/first_line(*)/data\n');
	//client.write('input core.weechat /help filter\n');
	//client.write('hdata buffer *\n');
	//client.write('hdata buffer:gui_buffers(*) number,name\n');
	client.write('(hei)nicklist\n');
});
*/
