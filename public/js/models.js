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
    activity: 0
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

  findByNickPart: function(part) {
    part = part.toLowerCase();
    return this.get('users').find(function(user) {
      return user.get('title').toLowerCase().indexOf(part) >= 0;
    });
  }
});

User = Backbone.RelationalModel.extend({});

Message = Backbone.RelationalModel.extend({
  initialize: function() {
    var text = utils.color(this.get('message'));
    var from = utils.color(this.get('from'));
    this.set('text', text);
    this.set('from', from);
  }
});
