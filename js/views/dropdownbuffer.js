$(function() {
  DropdownBufferView = Backbone.View.extend({
    template: _.template($('#dropdown-buffer-template').html()),
    templateOption: _.template($('#dropdown-option-buffer-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'add:buffers', this.addBuffer);
    },

    addBuffer: function(buffer) {
      var tpl = this.templateOption(buffer.toJSON()).trim();
      var $el = $(tpl.trim());
      this.$el.append($el);

      var text = $el.text();
      buffer.on('change:activity', function(b, activity) {
        activity = activity || '';
        $el.text(activity + ' ' + text);

        var totalActivity = buffers.getActivity() || '';
        var mentioned = buffers.getMentioned();
        $('#total-activity').text(totalActivity).toggleClass('badge-important', mentioned);

        document.title = 'WeeCloud' + (mentioned ? ' | Urgent' : '');
      });
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      return this;
    }
  });
});
