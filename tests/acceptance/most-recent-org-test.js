import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import stubLockModal from 'percy-web/tests/helpers/stub-lock-modal';
import localStorageProxy from 'percy-web/lib/localstorage';
import SetupLocalStorageSandbox from 'percy-web/tests/helpers/setup-localstorage-sandbox';

describe('Acceptance: Most recent org', function() {
  describe('when user is not logged in', function() {
    setupAcceptance({authenticate: false});

    setupSession(function() {
      stubLockModal(this.application);
      this.loginUser = false;
    });

    it('redirects to login', async function() {
      await visit('/most-recent-org');
      expect(currentPath()).to.equal('login');
    });
  });

  describe('when user is logged in', function() {
    setupAcceptance();
    SetupLocalStorageSandbox();

    describe('when user has organizations', function() {
      let organization;
      let otherOrganization;

      setupSession(function(server) {
        const user = server.create('user');
        organization = server.create('organization');
        otherOrganization = server.create('organization');
        server.create('organizationUser', {organization, user});
        server.create('organizationUser', {organization: otherOrganization, user});
      });

      it("redirects to user's most recent org", async function() {
        localStorageProxy.set('lastOrganizationSlug', otherOrganization.slug);
        await visit('/most-recent-org');
        expect(currentPath()).to.equal('organization.index');
        expect(currentURL()).to.include(otherOrganization.slug);
      });
    });

    describe('when user does not have organizations', function() {
      setupSession(function(server) {
        server.create('user');
      });

      it('redirects to organizations.new', async function() {
        await visit('/most-recent-org');
        expect(currentPath()).to.equal('organizations.new');
      });
    });
  });
});
