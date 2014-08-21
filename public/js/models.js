Server = Backbone.RelationalModel.extend({
  relations: [{
    type: Backbone.HasMany,
    key: 'buffers',
    relatedModel: 'Buffer',
    collectionType: 'BufferCollection',
    reverseRelation: {
      key: 'livesIn',
      includeInJSON: 'id'
    }
  }]
});

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
  }],

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

User = Backbone.RelationalModel.extend({});

Message = Backbone.RelationalModel.extend({
  initialize: function() {
    var text = utils.color(this.get('message'));
    var from = utils.color(this.get('from'));
    var m = text.match(/(https?:\/\/.+?\.(png|gif|jpg|jpeg))/);
    if (m == null) {
      this.set('thumbnail', null);
    } else {
      this.set('thumbnail', m[1]);
    }
    this.set('text', text);
    this.set('from', from);
  }
});
