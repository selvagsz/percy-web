import DS from 'ember-data';
import utils from 'percy-web/lib/utils';

export default DS.Model.extend({
  project: DS.belongsTo('project'),
  url: DS.attr(),
  description: DS.attr(),
  status: DS.attr(),
  subscribedEvents: DS.attr({
    defaultValue() {
      return ['ping'];
    },
  }),
  deliveryEnabled: DS.attr('boolean', {defaultValue: true}),
  sslVerificationEnabled: DS.attr('boolean', {defaultValue: true}),
  authToken: DS.attr({
    defaultValue() {
      return utils.generateRandomToken();
    },
  }),
});
