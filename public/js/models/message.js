var relay = relay || {};

(function() {
    relay.Message = Backbone.Model.extend({
        defaults: {
            from: '',
            to: '',
            content: ''
        }
    });
}());
