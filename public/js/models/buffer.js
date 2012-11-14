(function() {
    relay.Buffer = Backbone.Model.extend({
        defaults: {
            from: '',
            to: '',
            content: ''
        }
    });
}());
