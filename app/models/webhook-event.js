import DS from 'ember-data';
import {computed} from '@ember/object';
import {not} from '@ember/object/computed';

export default DS.Model.extend({
  webhookConfig: DS.belongsTo('webhook-config'),
  event: DS.attr(),
  requestHeaders: DS.attr(),
  requestPayload: DS.attr('string'),
  responseHeaders: DS.attr(),
  responsePayload: DS.attr(),
  responseStatus: DS.attr('number'),
  responseTimeMs: DS.attr('number'),
  failureReason: DS.attr(),
  createdAt: DS.attr('date'),

  isSuccess: not('isFailure'),

  isFailure: computed('failureReason', 'responseStatus', function() {
    const status = this.get('responseStatus');

    return this.get('failureReason') || !(status >= 200 && status < 300);
  }),
});
