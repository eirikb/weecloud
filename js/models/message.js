Message = Backbone.RelationalModel.extend({
  initialize: function() {
    var text = utils.color(this.get('message'));
    var from = utils.color(this.get('from'));
    this.set('text', text);
    this.set('from', from);
  }
});
