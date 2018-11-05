import FactoryGuy from 'ember-data-factory-guy';
import moment from 'moment';

FactoryGuy.define('webhook-event', {
  default: {
    webhookConfig: FactoryGuy.belongsTo('webhook-config'),
    event: 'ping',
    url: 'https://percy.town/webhooks',
    requestHeaders: {'Content-Type': 'application/json'},
    requestPayload: '{"foo": "bar"}',
    responseHeaders: {Foo: 'bar'},
    responsePayload: 'ok',
    responseStatus: 200,
    responseTimeMs: 150,
    failureReason: null,
    createdAt: () => moment(),
  },
});
