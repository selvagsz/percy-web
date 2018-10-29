import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import {percySnapshot} from 'ember-percy';
import WebhookEvent from 'percy-web/tests/pages/components/webhook-event';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import freezeMoment from 'percy-web/tests/helpers/freeze-moment';

describe('Integration: WebhookEvent', function() {
  setupComponentTest('webhook-event', {integration: true});
  freezeMoment('2017-05-22');

  const deliveryUrl = 'http://example.com';

  beforeEach(function() {
    setupFactoryGuy(this.container);
    WebhookEvent.setContext(this);
    this.set('deliveryUrl', deliveryUrl);
    this.render(hbs`{{webhook-event
      webhookEvent=webhookEvent
      deliveryUrl=deliveryUrl
    }}`);
  });

  it('displays webhook event data', function() {
    this.set('webhookEvent', make('webhook-event'));

    percySnapshot(this.test.fullTitle());
    expect(WebhookEvent.id).to.equal('1');
    expect(WebhookEvent.deliveryUrl).to.equal(`POST ${deliveryUrl}`);
    expect(WebhookEvent.status).to.equal('200');
    expect(WebhookEvent.responseTime).to.equal('Delivered in 150ms');
  });

  context('when detail view is opened', function() {
    it('displays request headers and payload', function() {
      this.set(
        'webhookEvent',
        make('webhook-event', {
          requestHeaders: {'X-Request': 'yep'},
          requestPayload: 'request!!',
        }),
      );

      WebhookEvent.toggleOpen();

      percySnapshot(this.test.fullTitle());

      expect(WebhookEvent.headers).to.match(/X-Request/);
      expect(WebhookEvent.payload).to.match(/request!!/);
    });
  });

  context('when response tab is opened', function() {
    it('displays response headers and payload', function() {
      this.set(
        'webhookEvent',
        make('webhook-event', {
          responseHeaders: {'X-Response': 'yep'},
          responsePayload: 'response!!',
        }),
      );

      WebhookEvent.toggleOpen();
      WebhookEvent.openResponseTab();

      percySnapshot(this.test.fullTitle());

      expect(WebhookEvent.headers).to.match(/X-Response/);
      expect(WebhookEvent.payload).to.match(/response!!/);
    });
  });

  context('when http error', function() {
    it('displays response code', function() {
      this.set(
        'webhookEvent',
        make('webhook-event', {
          responseStatus: '404',
        }),
      );

      percySnapshot(this.test.fullTitle());

      expect(WebhookEvent.status).to.eq('404');
    });
  });

  context('when non-http error', function() {
    it('displays meaningful error message', function() {
      this.set(
        'webhookEvent',
        make('webhook-event', {
          failureReason: 'ssl_verification_failed',
        }),
      );

      WebhookEvent.toggleOpen();

      percySnapshot(this.test.fullTitle());

      expect(WebhookEvent.failureMessage).to.match(/unable to verify/);
    });
  });
});
