$(function() {
  BufferMenuView = Backbone.View.extend({
    template: _.template($('#buffer-menu-template').html()),

    events: {
      'shown': 'open'
    },

    initialize: function() {
      this.listenTo(this.model, 'change:activity', this.activity);
    },

    activity: function() {
      var activity = this.model.get('activity');
      if (!activity) activity = '';
      var mentioned = !! this.model.get('mentioned');
      this.$('.badge').text(activity).toggleClass('badge-important', mentioned);
    },

    open: function() {
      $('#bufferlist .active').removeClass('active');
      this.$el.addClass('active');
      this.model.trigger('open', this.model);
      this.model.set('mentioned', false);
      this.model.set('activity', 0);
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });
});
