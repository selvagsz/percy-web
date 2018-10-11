import DS from 'ember-data';

export default DS.Model.extend({
  project: DS.belongsTo('project', {async: false}),
  url: DS.attr(),
  description: DS.attr(),
  subscribedEvents: DS.attr({
    defaultValue() {
      return ['ping'];
    },
  }),
  deliveryEnabled: DS.attr('boolean', {defaultValue: true}),
  sslVerificationEnabled: DS.attr('boolean', {defaultValue: true}),
  authToken: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
});
