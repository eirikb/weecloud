WeeCloud
========

Node.js library for relaying WeeChat to a webapp

Relaying with [weechat.js](https://github.com/eirikb/weechat.js)

Usage
---

**WeeChat**

Require [WeeChat 0.3.7-dev](http://www.weechat.org/download/devel/).  
WeeChat Relay Protocol is bleeding edge, and does not work in 0.3.6.  
Start WeeChat Relay Protocol:  

    /set relay.network.password test
    /relay add weechat 8000 test
