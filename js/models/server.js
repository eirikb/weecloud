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
    }
  ]
});
