import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('webhook-event', {
  default: {
    webhookConfig: FactoryGuy.belongsTo('webhook-config'),
    event: 'ping',
    requestHeaders: {'Content-Type': 'application/json'},
    requestPayload: '{"foo": "bar"}',
    responseHeaders: {Foo: 'bar'},
    responsePayload: 'ok',
    responseStatus: 200,
    responseTimeMs: 150,
    failureReason: null,
    createdAt: Date.now(),
  },
});
