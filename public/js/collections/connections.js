(function() {
    var ConnectionList = Backbone.Collection.extend({
        model: lobby.Connection,
        localStorage: new Store('connections')
    });

    lobby.Connections = new ConnectionList();
}());
