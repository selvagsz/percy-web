import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';

describe('Acceptance: Marketing pages', function() {
  function visitAllMarketingPages({takeSnapshot = false}) {
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

  context('user is unauthenticated', function() {
    setupAcceptance({authenticate: false});

    visitAllMarketingPages({takeSnapshot: true});
  });

  context('user is authenticated', function() {
    setupAcceptance({authenticate: true});

    setupSession(function(server) {
      server.create('user');
    });

    visitAllMarketingPages({takeSnapshot: false});
  });
});
