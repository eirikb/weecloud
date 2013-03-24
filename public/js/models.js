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
  }]
});

Message = Backbone.RelationalModel.extend({});
