import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import {beforeEach} from 'mocha';
import stubLockModal from 'percy-web/tests/helpers/stub-lock-modal';

describe('Acceptance: Marketing pages', function() {
  function visitAllMarketingPages({authenticated = false, takeSnapshot = false}) {
    it('can visit /', async function() {
      await visit('/');
      expect(currentPath()).to.equal('index');
      await percySnapshot(this.test);
    });
    it('can visit /pricing', async function() {
      await visit('/pricing');
      expect(currentPath()).to.equal('pricing');
      if (takeSnapshot) {
        await percySnapshot(this.test);
      }
    });
    describe('pricing page', function() {
      beforeEach(async function() {
        await visit('/pricing');
      });
      it('can select startup plan', async function() {
        stubLockModal(this.application);
        await click('[data-test-small-pricing-card-cta]');
        const expectedPath = authenticated ? 'organizations.new' : 'login';
        expect(currentPath()).to.equal(expectedPath);
      });
      it('can select business plan', async function() {
        await click('[data-test-medium-pricing-card-cta]');
        expect(currentPath()).to.equal('enterprise');
      });
      it('can select enterprise plan', async function() {
        await click('[data-test-large-pricing-card-cta]');
        expect(currentPath()).to.equal('enterprise');
      });
      it('can select "Sign up for a free personal account."', async function() {
        stubLockModal(this.application);
        await click('[data-test-free-personal-account]');
        const expectedPath = authenticated ? 'organizations.new' : 'login';
        expect(currentPath()).to.equal(expectedPath);
      });
    });
    it('can visit /team', async function() {
      await visit('/team');
      expect(currentPath()).to.equal('team');
      if (takeSnapshot) {
        await percySnapshot(this.test);
      }
    });
    it('can visit /security', async function() {
      await visit('/security');
      expect(currentPath()).to.equal('security');
      if (takeSnapshot) {
        await percySnapshot(this.test);
      }
    });
    it('can visit /terms', async function() {
      await visit('/terms');
      expect(currentPath()).to.equal('terms');
      if (takeSnapshot) {
        await percySnapshot(this.test);
      }
    });
    it('can visit /privacy', async function() {
      await visit('/privacy');
      expect(currentPath()).to.equal('privacy');
      if (takeSnapshot) {
        await percySnapshot(this.test);
      }
    });
  }

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
