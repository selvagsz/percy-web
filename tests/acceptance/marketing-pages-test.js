import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import {beforeEach} from 'mocha';
import stubLockModal from 'percy-web/tests/helpers/stub-lock-modal';
import {visit, currentRouteName, click, findAll} from '@ember/test-helpers';
import {percySnapshot} from 'ember-percy';
import {withVariation} from 'ember-launch-darkly/test-support/helpers/with-variation';

describe('Acceptance: Marketing pages', function() {
  function visitAllMarketingPages({authenticated = false, takeSnapshot = false}) {
    it('can visit /', async function() {
      await visit('/');
      expect(currentRouteName()).to.equal('index');
      await percySnapshot(this.test.fullTitle());
    });

    it('can visit /features', async function() {
      await visit('/features');
      expect(currentRouteName()).to.equal('features');
      await percySnapshot(this.test.fullTitle());
    });

    it('can visit /how-it-works', async function() {
      await visit('/how-it-works');
      expect(currentRouteName()).to.equal('how-it-works');
      await percySnapshot(this.test.fullTitle());
    });

    it('can visit /visual-testing', async function() {
      await visit('/visual-testing');
      expect(currentRouteName()).to.equal('visual-testing');
      await percySnapshot(this.test.fullTitle());
    });

    it('can visit enterprise', async function() {
      await visit('enterprise');
      expect(currentRouteName()).to.equal('enterprise');
      await percySnapshot(this.test.fullTitle());
    });

    it('can visit /schedule-demo', async function() {
      await visit('/schedule-demo');
      expect(currentRouteName()).to.equal('schedule-demo');
      await percySnapshot(this.test);
    });

    it('can visit /pricing', async function() {
      withVariation(this.owner, 'updated-pricing-page', false); // eslint-disable-line
      await visit('pricing');
      expect(currentRouteName()).to.equal('pricing');
      await percySnapshot(this.test.fullTitle());
    });

    it('can visit new /pricing', async function() {
      withVariation(this.owner, 'updated-pricing-page', true); // eslint-disable-line
      await visit('pricing');
      expect(currentRouteName()).to.equal('pricing');
      await percySnapshot(this.test.fullTitle());
    });

    describe('pricing page', function() {
      let cardCtas;
      beforeEach(async function() {
        withVariation(this.owner, 'updated-pricing-page', true); // eslint-disable-line
        await visit('/pricing');
        cardCtas = findAll('[data-test-pricing-card-cta]');
      });
      it('can select startup plan', async function() {
        stubLockModal(this.owner);
        await click(cardCtas[0]);
        const expectedPath = authenticated ? 'organizations.new' : 'login';
        expect(currentRouteName()).to.equal(expectedPath);
      });
      it('can select business plan', async function() {
        await click(cardCtas[1]);
        expect(currentRouteName()).to.equal('schedule-demo');
      });
      it('can select enterprise plan', async function() {
        await click(cardCtas[2]);
        expect(currentRouteName()).to.equal('schedule-demo');
      });
    });

    it('can visit /team', async function() {
      await visit('/team');
      expect(currentRouteName()).to.equal('team');
      if (takeSnapshot) {
        await percySnapshot(this.test.fullTitle());
      }
    });
    it('can visit /security', async function() {
      await visit('/security');
      expect(currentRouteName()).to.equal('security');
      if (takeSnapshot) {
        await percySnapshot(this.test.fullTitle());
      }
    });
    it('can visit /terms', async function() {
      await visit('/terms');
      expect(currentRouteName()).to.equal('terms');
      if (takeSnapshot) {
        await percySnapshot(this.test.fullTitle());
      }
    });
    it('can visit /privacy', async function() {
      await visit('/privacy');
      expect(currentRouteName()).to.equal('privacy');
      if (takeSnapshot) {
        await percySnapshot(this.test.fullTitle());
      }
    });
  }

  describe('menu bar', function() {
    setupAcceptance({authenticate: true});
    setupSession(function(server) {
      server.create('user');
    });

    it('opens dropdown when product is clicked on light background', async function() {
      await visit('/');

      await click('[data-test-responsive-nav-toggle]');
      percySnapshot(`${this.test.fullTitle()} -- small screen dropdown`, {widths: [375]});
    });

    it('opens dropdown when product is clicked on dark background', async function() {
      await visit('enterprise');

      await click('[data-test-responsive-nav-toggle]');
      percySnapshot(`${this.test.fullTitle()} -- small screen dropdown`, {widths: [375]});
    });
  });

  describe('user is unauthenticated', function() {
    setupAcceptance({authenticate: false});

    visitAllMarketingPages({authenticated: false, takeSnapshot: true});
  });

  describe('user is authenticated', function() {
    setupAcceptance({authenticate: true});

    setupSession(function(server) {
      server.create('user');
    });

    visitAllMarketingPages({authenticated: true, takeSnapshot: false});
  });
});
