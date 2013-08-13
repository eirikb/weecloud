$(function() {
  ServerView = Backbone.View.extend({
    template: _.template($('#server-menu-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'add:buffers', this.addBuffer);
      this.listenTo(this.model, 'change:activity:buffers', this.activity);
    },

    addBuffer: function(buffer) {
      var bufferMenuView = new BufferMenuView({
        model: buffer
      });
      var bufferView = new BufferView({
        model: buffer
      });
      this.$el.find('.nav').append(bufferMenuView.render().$el);
      //this.$el.last().append(bufferMenuView.render().$el);
      //this.$el.after(bufferMenuView.render().$el);
      //$('#buffers').children().append(bufferView.render().$el);

      var self = this;
      buffer.on('change:activity', function(buffer, activity) {
        self.activity(self, activity);
      });
    },

    activity: function(self, buffer, activity) {
      //var activity = buffer.get('activity');
      if (!activity) activity = '';
      self.$el.css('text-decoration', 'underline');
      //var mentioned = !! this.model.get('mentioned');
      //this.$('.badge').text(activity).toggleClass('badge-important', mentioned);
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });
});
