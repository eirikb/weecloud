Buffer = Backbone.RelationalModel.extend({
  defaults: {
    activity: 0,
    activityList: []
  },

  relations: [{
      type: Backbone.HasMany,
      key: 'messages',
      relatedModel: 'Message',
      collectionType: 'MessageCollection',
      reverseRelation: {
        key: 'livesIn',
        includeInJSON: 'id'
      }
    }, {
      type: Backbone.HasMany,
      key: 'users',
      relatedModel: 'User',
      collectionType: 'UserCollection',
      reverseRelation: {
        key: 'livesIn',
        includeInJSON: 'id'
      }
    }
  ],

  incActivity: function() {
    var activity = this.get('activity');
    this.set('activity', activity + 1);
  },

  setMentioned: function() {
    this.set('mentioned', true);
  },

  findByNickPart: function(part) {
    part = part.toLowerCase();

    function find(user) {
      return user.get('title').toLowerCase().indexOf(part) >= 0;
    }

    var users = this.get('users');
    users = _.chain(this.get('activityList')).map(function(id) {
      return users.get(id);
    }).filter(function(user) {
      return user;
    }).value();

    var user = _.find(users, find);
    if (user) return user;

    return this.get('users').find(find);
  },

  addUserIdToActivityList: function(id) {
    if (!id) return;

    var activityList = this.get('activityList');
    if (activityList.length > 10) activityList.pop();
    activityList.unshift(id);
  }
});
