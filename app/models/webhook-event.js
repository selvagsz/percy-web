import DS from 'ember-data';

export default DS.Model.extend({
  webhookConfig: DS.belongsTo('webhook-config'),
  event: DS.attr(),
  request_headers: DS.attr(),
  request_payload: DS.attr(),
  response_headers: DS.attr(),
  response_payload: DS.attr(),
  response_status: DS.attr('number'),
  response_time_ms: DS.attr('number'),
  failure_reason: DS.attr(),
  created_at: DS.attr('date'),
});
