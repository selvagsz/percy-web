import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import {percySnapshot} from 'ember-percy';
import WebhookEvent from 'percy-web/tests/pages/components/webhook-event';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import freezeMoment from 'percy-web/tests/helpers/freeze-moment';

describe('Integration: WebhookEvent', function() {
  setupRenderingTest('webhook-event', {integration: true});
  freezeMoment('2017-05-22');

  beforeEach(async function() {
    setupFactoryGuy(this);
    WebhookEvent.setContext(this);
    await this.render(hbs`{{webhook-event webhookEvent=webhookEvent}}`);
  });

  it('displays webhook event data', async function() {
    this.set('webhookEvent', make('webhook-event'));

    await percySnapshot(this.test.fullTitle());
    expect(WebhookEvent.id).to.equal('1');
    expect(WebhookEvent.deliveryUrl).to.equal('POST https://percy.town/webhooks');
    expect(WebhookEvent.status).to.equal('200');
    expect(WebhookEvent.responseTime).to.equal('Delivered in 150ms');
  });

  context('when detail view is opened', function() {
    it('displays request headers and payload', async function() {
      this.set(
        'webhookEvent',
        make('webhook-event', {
          requestHeaders: {'X-Request': 'yep'},
          requestPayload: 'request!!',
        }),
      );

      await WebhookEvent.toggleOpen();

      await percySnapshot(this.test.fullTitle());

      expect(WebhookEvent.headers).to.match(/X-Request/);
      expect(WebhookEvent.payload).to.match(/request!!/);
    });
  });

  context('when response tab is opened', function() {
    it('displays response headers and payload', async function() {
      this.set(
        'webhookEvent',
        make('webhook-event', {
          responseHeaders: {'X-Response': 'yep'},
          responsePayload: 'response!!',
        }),
      );

      await WebhookEvent.toggleOpen();
      await WebhookEvent.openResponseTab();

      await percySnapshot(this.test.fullTitle());

      expect(WebhookEvent.headers).to.match(/X-Response/);
      expect(WebhookEvent.payload).to.match(/response!!/);
    });
  });

  context('when http error', function() {
    it('displays response code', async function() {
      this.set(
        'webhookEvent',
        make('webhook-event', {
          responseStatus: '404',
        }),
      );

      await percySnapshot(this.test.fullTitle());

      expect(WebhookEvent.status).to.eq('404');
    });
  });

  context('when non-http error', function() {
    it('displays meaningful error message', async function() {
      this.set(
        'webhookEvent',
        make('webhook-event', {
          failureReason: 'ssl_verification_failed',
        }),
      );

      await WebhookEvent.toggleOpen();

      await percySnapshot(this.test.fullTitle());

      expect(WebhookEvent.failureMessage).to.match(/unable to verify/);
    });
  });
});
