import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import GitlabSettings from 'percy-web/tests/pages/components/gitlab-settings';
import sinon from 'sinon';
import utils from 'percy-web/lib/utils';
import {afterEach} from 'mocha';

describe('Acceptance: Gitlab Settings', function() {
  setupAcceptance();

  describe('with a standard user', function() {
    let organization;
    setupSession(function(server) {
      organization = server.create('organization', 'withUser', 'withGitlabIntegration');
    });

    it('does not show gitlab settings', async function() {
      await visit(`/organizations/${organization.slug}/integrations/gitlab`);
      expect(currentPath()).to.equal('organizations.organization.integrations.gitlab');
      expect(GitlabSettings.integrationSettings.personalAccessTokenField.isVisible).to.equal(false);
      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('with an admin user', function() {
    describe('without a gitlab integration', function() {
      let organization;
      setupSession(function(server) {
        organization = server.create('organization', 'withAdminUser');
      });

      it('allows the integration to be installed', async function() {
        await visit(`/organizations/${organization.slug}/integrations/gitlab`);
        expect(currentPath()).to.equal('organizations.organization.integrations.gitlab');
        await GitlabSettings.install();

        expect(
          GitlabSettings.integrationSettings.personalAccessTokenField.inputPlaceholder,
        ).to.equal('Personal access token');
        expect(GitlabSettings.integrationSettings.personalAccessTokenField.text).to.equal(
          'Personal access token (not installed)',
        );

        await percySnapshot(this.test.fullTitle());
      });
    });

    describe('with a gitlab integration', function() {
      let organization;
      setupSession(function(server) {
        organization = server.create('organization', 'withAdminUser', 'withGitlabIntegration');
      });

      it('allows editing gitlab settings', async function() {
        await visit(`/organizations/${organization.slug}/integrations/gitlab`);
        expect(currentPath()).to.equal('organizations.organization.integrations.gitlab');
        GitlabSettings.integrationSettings.personalAccessTokenField.fillIn('xx');
        await GitlabSettings.integrationSettings.toolbar.save();
        await percySnapshot(this.test.fullTitle() + ' with an invalid token');

        GitlabSettings.integrationSettings.personalAccessTokenField.fillIn('xxxxxxxxxxxxxxxxxxxx');
        await GitlabSettings.integrationSettings.toolbar.save();

        expect(GitlabSettings.integrationSettings.personalAccessTokenField.text).to.equal(
          'Personal access token (installed by you)',
        );
        await percySnapshot(this.test.fullTitle() + ' with a valid token');

        await GitlabSettings.integrationSettings.toolbar.back();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');
      });
    });

    describe('with a gitlab integration and personal access token', function() {
      let organization;
      let windowStub;
      setupSession(function(server) {
        organization = server.create(
          'organization',
          'withAdminUser',
          'withCompleteGitlabIntegration',
        );
        windowStub = sinon.stub(utils, 'confirmMessage').returns(true);
      });

      afterEach(function() {
        windowStub.restore();
      });

      it('allows deleting the integration', async function() {
        await visit(`/organizations/${organization.slug}/integrations/gitlab`);
        expect(GitlabSettings.integrationSettings.personalAccessTokenField.text).to.equal(
          'Personal access token (installed by you)',
        );
        await GitlabSettings.delete();
        expect(GitlabSettings.integrationSettings.personalAccessTokenField.isVisible).to.equal(
          false,
        );
        expect(GitlabSettings.integrationButton.isVisible).to.equal(true);
        expect(GitlabSettings.integrationButton.text).to.equal('Connect to GitLab');
        await percySnapshot(this.test.fullTitle());
      });
    });
  });
});
