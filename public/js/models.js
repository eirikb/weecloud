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
  }]
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
