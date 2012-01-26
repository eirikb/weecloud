WeeCloud
========

Node.js library for relaying WeeChat to a webapp

Usage
---

**WeeChat**

*  Install [WeeChat 0.3.7-dev](http://www.weechat.org/download/devel/).  
   weechat relay protocol is bleeding edge, and does not work in 0.3.6.
*  Then set a password like this

        /set relay.network.password test
*  Then start weechat relay protocol like this

        /relay add weechat 8000 

**Node.js**

*  Install [Node.js](http://nodejs.org).
*  Clone the project

        git clone https://github.com/eirikb/weecloud.git
    For the moment I don't have a npm package (will create one eventually).   
*  Run it, default password is 'test' and port is 8000 (it's in weecloud.js)

        node weecloud.js

Then you can hook up your browser to http://localhost:7000 and enjoy the show.

weechat relay protocol module
===

The weechat relay protocol can be found in npm

    npm install weechat

And can be used like this:

    var weechat = requrie('weechat');

    // Can only connect to localhost
    // First argument is port, second is password
    weechat.connect(8000, 'test', function(ok) {
        if (ok) {
            console.log('Connected!');

            weechat.write('info version', function(version) {
                console.log('WeeChat version', version);
            });
        }
    });

    weechat.on('_buffer_line_added', function(line) {
        console.log('Got a line!', line);
    });
