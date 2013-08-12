$(function() {
  UserListView = Backbone.Marionette.CollectionView.extend({
    template: _.template($('#user-list-template').html()),

    initialize: function() {
      this.listenTo(this.model, 'add:users', this.addUser);
      this.listenTo(this.model, 'open', this.open);
    },

    addUser: function(user) {
      var view = new UserView({
        model: user
      });
      this.$el.append(view.render().$el);
    },

    render: function() {
      var tpl = this.template(this.model.toJSON()).trim();
      this.setElement(tpl.trim(), true);
      this.open();
      return this;
    },

    open: function() {
      $('#userlist ul').hide();
      this.$el.show();
      $('#userlist').toggle(this.model.get('type') !== 'private');
      this.model.trigger('scroll-bottom');
    }
  });

  UserView = Backbone.Marionette.ItemView.extend({
    template: _.template($('#user-template').html())
  });
});
