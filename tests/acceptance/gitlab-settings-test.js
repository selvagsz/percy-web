import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import GitlabSettings from 'percy-web/tests/pages/components/gitlab-settings';
import IntegrationsIndexPage from 'percy-web/tests/pages/integrations-index-page';
import sinon from 'sinon';
import utils from 'percy-web/lib/utils';
import {afterEach} from 'mocha';
import AdminMode from 'percy-web/lib/admin-mode';

describe('Acceptance: GitLab Integration Settings', function() {
  setupAcceptance();

  let urlParams = (organization, integrationType) => {
    return {
      orgSlug: organization.slug,
      integrationType: integrationType,
    };
  };

  describe('with a standard user', function() {
    describe('with a gitlab integration', function() {
      let organization;
      let integrationType;
      setupSession(function(server) {
        organization = server.create('organization', 'withUser', 'withGitlabIntegration');
        integrationType = 'gitlab';
      });

      it('does not show gitlab settings', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, integrationType));
        expect(currentPath()).to.equal('organizations.organization.integrations.gitlab');
        expect(GitlabSettings.isFormHidden, 'Expected integration to be hidden').to.equal(true);
        expect(GitlabSettings.integrationText).to.equal(
          'This feature requires organization admin permissions.',
        );
        await percySnapshot(this.test.fullTitle());
      });
    });

    describe('with a gitlab self-hosted integration', function() {
      let organization;
      setupSession(function(server) {
        organization = server.create('organization', 'withUser', 'withGitlabSelfHostedIntegration');
      });

      it('does not show gitlab self-hosted settings', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab-self-hosted'));
        expect(currentPath()).to.equal(
          'organizations.organization.integrations.gitlab-self-hosted',
        );
        expect(GitlabSettings.isFormHidden, 'Expected integration to be hidden').to.equal(true);
        expect(GitlabSettings.integrationText).to.equal(
          'This feature requires organization admin permissions.',
        );
        await percySnapshot(this.test.fullTitle());
      });
    });
  });

  describe('with an admin user', function() {
    let organization;
    setupSession(function(server) {
      organization = server.create('organization', 'withAdminUser');
    });

    describe('without an existing gitlab integration', function() {
      it('allows the integration to be installed', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab'));
        expect(currentPath()).to.equal('organizations.organization.integrations.gitlab');

        await GitlabSettings.integrationSettings.personalAccessTokenField.fillIn(
          'xxxxxxxxxxxxxxxxxxxx',
        );
        await GitlabSettings.integrationSettings.toolbar.save();
        expect(GitlabSettings.isErrorPresent).to.equal(false, 'There were errors with the form');
        await percySnapshot(this.test.fullTitle());
      });
    });

    describe('with a gitlab integration', function() {
      setupSession(function(server) {
        server.create('versionControlIntegration', 'gitlab', {organization});
      });

      it('allows editing gitlab settings', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab'));
        expect(currentPath()).to.equal('organizations.organization.integrations.gitlab');

        await GitlabSettings.integrationSettings.personalAccessTokenField.fillIn(
          'xxxxxxxxxxxxxxxxxxxx',
        );
        await GitlabSettings.integrationSettings.toolbar.save();
        expect(GitlabSettings.isErrorPresent).to.equal(false, 'There were errors with the form');
        await percySnapshot(this.test.fullTitle());
        await GitlabSettings.integrationSettings.toolbar.back();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');
      });

      it('can return to the index page', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab'));
        expect(currentPath()).to.equal('organizations.organization.integrations.gitlab');

        await GitlabSettings.integrationSettings.toolbar.back();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');
      });
    });

    describe('with an existing gitlab integration', function() {
      let windowStub;
      setupSession(function(server) {
        server.create('versionControlIntegration', 'gitlab', {organization});
        windowStub = sinon.stub(utils, 'confirmMessage').returns(true);
      });

      afterEach(function() {
        windowStub.restore();
      });

      it('allows deleting the integration', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab'));
        expect(
          GitlabSettings.integrationSettings.personalAccessTokenField.inputPlaceholder,
        ).to.equal('••••••••••••••••••••', 'Personal access token not installed');

        await GitlabSettings.delete();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');

        await percySnapshot(this.test.fullTitle());
      });
    });

    describe('without a gitlab self-hosted integration', function() {
      let organization;
      setupSession(function(server) {
        organization = server.create('organization', 'withAdminUser');
      });

      it('allows the integration to be installed', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab-self-hosted'));

        expect(currentPath()).to.equal(
          'organizations.organization.integrations.gitlab-self-hosted',
        );

        expect(
          GitlabSettings.integrationSettings.personalAccessTokenField.inputPlaceholder,
        ).to.equal('Personal access token', 'A personal access token has already been installed');
        await GitlabSettings.integrationSettings.gitlabHostField.fillIn('https://gitlab.percy.io');
        await GitlabSettings.integrationSettings.personalAccessTokenField.fillIn(
          'xxxxxxxxxxxxxxxxxxxx',
        );
        await GitlabSettings.integrationSettings.toolbar.save();
        expect(GitlabSettings.isErrorPresent).to.equal(false, 'There were errors with the form');

        await percySnapshot(this.test.fullTitle());
      });
    });

    describe('with a gitlab self-hosted integration', function() {
      let organization;
      setupSession(function(server) {
        organization = server.create(
          'organization',
          'withAdminUser',
          'withGitlabSelfHostedIntegration',
        );
      });

      it('allows editing settings', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab-self-hosted'));
        expect(currentPath()).to.equal(
          'organizations.organization.integrations.gitlab-self-hosted',
        );

        expect(GitlabSettings.isDeleteButtonDisabled, 'Delete button is disabled').to.eq(false);
        await GitlabSettings.integrationSettings.gitlabHostField.fillIn('https://gitlab.percy.io');
        await GitlabSettings.integrationSettings.personalAccessTokenField.fillIn(
          'xxxxxxxxxxxxxxxxxxxx',
        );
        await GitlabSettings.integrationSettings.toolbar.save();
        expect(GitlabSettings.isErrorPresent).to.equal(false, 'There were errors with the form');
        await percySnapshot(this.test.fullTitle());

        await GitlabSettings.integrationSettings.toolbar.back();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');
      });
    });

    describe('with a gitlab self-hosted integration', function() {
      let organization;
      let windowStub;
      setupSession(function(server) {
        organization = server.create(
          'organization',
          'withAdminUser',
          'withGitlabSelfHostedIntegration',
        );
        windowStub = sinon.stub(utils, 'confirmMessage').returns(true);
      });

      afterEach(function() {
        windowStub.restore();
      });

      it('allows deleting the integration', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab-self-hosted'));
        expect(currentPath()).to.equal(
          'organizations.organization.integrations.gitlab-self-hosted',
        );
        expect(GitlabSettings.isDeleteButtonDisabled, 'Delete button is disabled').to.eq(false);
        expect(GitlabSettings.isGitlabHostFieldVisible).to.equal(
          true,
          'Gitlab Host field is not visible',
        );
        await GitlabSettings.delete();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');
        expect(
          IntegrationsIndexPage.gitlabSelfHostedIntegration.hasInstallButton,
          'Install button is mising',
        ).to.equal(true);

        await percySnapshot(this.test.fullTitle());
      });
    });

    describe('with a gitlab self-hosted integration', function() {
      let organization;
      setupSession(function(server) {
        organization = server.create(
          'organization',
          'withAdminUser',
          'withGitlabSelfHostedIntegration',
        );
      });

      it('can return to the index page', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab-self-hosted'));
        expect(currentPath()).to.equal(
          'organizations.organization.integrations.gitlab-self-hosted',
        );

        await GitlabSettings.integrationSettings.toolbar.back();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');
      });
    });

    describe('without any integrations', function() {
      let organization;

      setupSession(function(server) {
        organization = server.create('organization', 'withAdminUser');
      });

      it('allows navigation between integrations', async function() {
        await GitlabSettings.visitSettings(urlParams(organization, 'gitlab-self-hosted'));
        let previouslyWasAdmin = AdminMode.isAdmin();
        AdminMode.setAdminMode();
        expect(currentPath()).to.equal(
          'organizations.organization.integrations.gitlab-self-hosted',
        );

        expect(GitlabSettings.integrationName).to.equal('GitLab Self-Managed Integration');
        await GitlabSettings.integrationSettings.toolbar.back();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');

        await IntegrationsIndexPage.gitlabIntegration.install();
        expect(GitlabSettings.integrationName).to.equal('GitLab Integration');

        await GitlabSettings.integrationSettings.toolbar.back();
        expect(currentPath()).to.equal('organizations.organization.integrations.index');

        await IntegrationsIndexPage.gitlabSelfHostedIntegration.install();
        expect(currentPath()).to.equal(
          'organizations.organization.integrations.gitlab-self-hosted',
        );
        expect(GitlabSettings.integrationName).to.equal('GitLab Self-Managed Integration');

        if (previouslyWasAdmin === false) {
          AdminMode.clear();
        }
      });
    });
  });
});
