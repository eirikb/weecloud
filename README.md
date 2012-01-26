WeeCloud
========

Node.js library for relaying WeeChat to a webapp

Usage
---

**WeeChat**

*  Install [WeeChat 0.3.7-dev](http://www.weechat.org/download/devel/)
. weechat relay protocol is bleeding edge, and does not work in 0.3.6.
*  Then set a password like this

        /set relay.network.password test
*  Then start weechat relay protocol like this

        /relay add weechat 8000 

**Node.js**

*  Install [Node.js](http://nodejs.org).
*  Clone the project

        git clone https://github.com/eirikb/weecloud.git
    For the moment I don't have a npm package (will create one eventually).   
*  Run it, default password is 'test' and port is 8000 (it's in weeclo
ud.js)

        node weecloud.js

