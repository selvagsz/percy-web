import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('webhook-config', {
  default: {
    url: 'http://example.com',
    description: 'Example webhook',
    status: 'ok',
    subscribedEvents: ['ping'],
    deliveryEnabled: true,
    sslVerificationEnabled: true,
    authToken: 'secure',
  },
});
