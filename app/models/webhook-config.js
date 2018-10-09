import DS from 'ember-data';

export default DS.Model.extend({
  project: DS.belongsTo('project', {async: false}),
  url: DS.attr(),
  description: DS.attr(),
  subscribedEvents: DS.attr(),
  deliveryEnabled: DS.attr('boolean'),
  sslVerificationEnabled: DS.attr('boolean'),
  authToken: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
});
