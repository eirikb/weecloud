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

Message = Backbone.RelationalModel.extend({
  initialize: function() {
    var date = new Date(this.get('date') * 1000);
    date = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
    this.set('date', date);
  }
});
