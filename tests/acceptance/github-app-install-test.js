import setupAcceptance, {setupSession} from 'percy-web/tests/helpers/setup-acceptance';
import GithubSettings from 'percy-web/tests/pages/components/github-settings';
import {beforeEach} from 'mocha';

describe('Acceptance: GitHubAppInstall', function() {
  setupAcceptance();

  describe('without a linked github account', function() {
    let organization;
    setupSession(function(server) {
      organization = server.create('organization', 'withNonGithubUser');
    });

    it('instructs a user to link a github account before installing the app', async function() {
      await GithubSettings.visitGithubSettings({orgSlug: organization.slug});
      expect(currentPath()).to.equal('organizations.organization.integrations.github');

      await percySnapshot(this.test);
    });
  });

  describe('with a linked github account', function() {
    let organization;
    setupSession(function(server) {
      organization = server.create('organization', 'withAdminGithubUser');
    });

    beforeEach(function() {
      GithubSettings.visitGithubSettings({orgSlug: organization.slug});
    });

    it('shows GitHub integration installation page', async function() {
      expect(currentPath()).to.equal('organizations.organization.integrations.github');

      await percySnapshot(this.test);
    });

    it('shows "Install Github" button when github is not installed', async function() {
      expect(GithubSettings.isGithubAppInstallButtonVisible).to.equal(true);

      await percySnapshot(this.test);
    });
  });

  describe('after github app installation is requested', function() {
    let organization;
    setupSession(function(server) {
      const githubIntegrationRequest = server.create('githubIntegrationRequest');
      organization = server.create('organization', 'withAdminGithubUser', {
        githubIntegrationRequest,
      });
      const user = organization.organizationUsers.models.mapBy('user')[0];

      githubIntegrationRequest.update({createdBy: user});
    });

    it('shows the loading state when the install is in progress', async function() {
      await GithubSettings.visitGithubSettings({orgSlug: organization.slug});
      expect(currentPath()).to.equal('organizations.organization.integrations.github');

      expect(GithubSettings.isGithubAppLoadingStateVisable).to.equal(true);

      await percySnapshot(this.test);
    });
  });

  describe('after github app installation is complete', function() {
    let organization;
    setupSession(function(server) {
      organization = server.create('organization', 'withGithubIntegration', 'withAdminGithubUser');
    });

    it('shows the installed state when the install is in successful', async function() {
      await GithubSettings.visitGithubSettings({orgSlug: organization.slug});
      expect(currentPath()).to.equal('organizations.organization.integrations.github');

      expect(GithubSettings.isGithubAppSuccessStateVisable).to.equal(true);

      await percySnapshot(this.test);
    });
  });
});
