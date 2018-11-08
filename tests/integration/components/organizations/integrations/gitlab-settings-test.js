import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {make} from 'ember-data-factory-guy';
import AdminMode from 'percy-web/lib/admin-mode';
import GitlabSettings from 'percy-web/tests/pages/components/gitlab-settings';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import sinon from 'sinon';
import mockIntercomService from 'percy-web/tests/helpers/mock-intercom-service';

describe('Integration: GitlabSettings', function() {
  setupRenderingTest('gitlab-settings', {
    integration: true,
  });

  beforeEach(function() {
    AdminMode.setAdminMode();
    setupFactoryGuy(this);
    GitlabSettings.setContext(this);
    const routeHelperStub = sinon.stub();
    this.set('actions', {redirectToIntegrationsIndex: routeHelperStub});
  });

  describe('with a gitlab integration', function() {
    beforeEach(async function() {
      const user = make('user');
      const organization = make('organization', 'withGitlabIntegration');
      const gitlabIntegration = organization.get('gitlabIntegration');
      const organizationUser = make('organization-user', 'adminUser', {organization, user});
      organization.set('_filteredOrganizationUsers', [organizationUser]);
      user.set('organizations', [organization]);
      this.setProperties({user, organization, gitlabIntegration});
      await this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
        currentGitlabIntegration=gitlabIntegration
      }}`);
    });

    it('shows the settings form', async function() {
      expect(GitlabSettings.isPersonalAccessTokenFieldVisible).to.eq(true);
      expect(GitlabSettings.integrationSettings.personalAccessTokenField.inputPlaceholder).to.equal(
        '••••••••••••••••••••',
        'Personal access token not installed',
      );
      expect(GitlabSettings.integrationSettings.personalAccessTokenField.text).to.equal(
        'Personal access token',
        'Personal access token label is incorrect',
      );
      expect(GitlabSettings.isGitlabHostFieldVisible).to.equal(
        false,
        'Gitlab Host field is visible when it should be hidden',
      );

      await percySnapshot(this.test.fullTitle());
    });

    it('validates the personal access token field', async function() {
      await GitlabSettings.integrationSettings.personalAccessTokenField.fillIn('wrong');
      await percySnapshot(this.test.fullTitle());
    });

    it('does not show the firewall contact link', async function() {
      expect(
        GitlabSettings.header.isFirewallNotePresent,
        'Firewall note should not be present',
      ).to.equal(false);
      expect(
        GitlabSettings.header.isSupportLinkPresent,
        'Support link is present, should not be',
      ).to.equal(false);
    });
  });

  describe('without an existing gitlab integration', function() {
    beforeEach(async function() {
      const user = make('user');
      const organization = make('organization', 'withNewGitlabIntegration');
      const gitlabIntegration = organization.get('gitlabIntegration');
      const organizationUser = make('organization-user', 'adminUser', {
        organization: organization,
        user: user,
      });
      organization.set('_filteredOrganizationUsers', [organizationUser]);
      user.set('organizations', [organization]);
      this.setProperties({user, organization, gitlabIntegration});
      await this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
        currentGitlabIntegration=gitlabIntegration
      }}`);
    });

    it('shows the settings form', async function() {
      expect(GitlabSettings.isDeleteButtonDisabled, 'Delete button is disabled').to.eq(false);
      expect(
        GitlabSettings.isPersonalAccessTokenFieldVisible,
        'Personal access token field not visible',
      ).to.eq(true);
      expect(GitlabSettings.integrationSettings.personalAccessTokenField.inputPlaceholder).to.equal(
        'Personal access token',
        'Personal access token placeholder is incorrect',
      );
      expect(GitlabSettings.integrationSettings.personalAccessTokenField.text).to.equal(
        'Personal access token',
        'Personal access token label is incorrect',
      );
      expect(GitlabSettings.isGitlabHostFieldVisible).to.equal(
        false,
        'Gitlab Host field is visible when it should be hidden',
      );
      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a gitlab self-hosted integration', function() {
    beforeEach(async function() {
      const user = make('user');
      const organization = make('organization', 'withGitlabSelfHostedIntegration');
      const gitlabIntegration = organization.get('gitlabSelfHostedIntegration');
      const organizationUser = make('organization-user', 'adminUser', {organization, user});
      organization.set('_filteredOrganizationUsers', [organizationUser]);
      user.set('organizations', [organization]);
      this.setProperties({user, organization, gitlabIntegration});
      await this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
        currentGitlabIntegration=gitlabIntegration
      }}`);
    });

    it('shows the firewall contact link', async function() {
      const showSupportStub = sinon.stub();
      mockIntercomService(this, showSupportStub);

      expect(
        GitlabSettings.header.isFirewallNotePresent,
        'Firewall note should be present',
      ).to.equal(true);
      expect(GitlabSettings.header.text).to.equal(
        'If you’re running GitLab behind a firewall, please get in touch.',
      );
      expect(GitlabSettings.header.isSupportLinkPresent, 'Support link is not present').to.equal(
        true,
      );

      await GitlabSettings.header.contactSupport();
      expect(showSupportStub).to.have.been.called;
    });

    it('shows the settings form', async function() {
      expect(GitlabSettings.isGitlabHostFieldVisible).to.equal(
        true,
        'Gitlab Host field not visible',
      );
      expect(
        GitlabSettings.isPersonalAccessTokenFieldVisible,
        'Personal access token field not visible',
      ).to.eq(true);
      expect(GitlabSettings.integrationSettings.personalAccessTokenField.text).to.equal(
        'Personal access token',
      );
      expect(GitlabSettings.integrationSettings.personalAccessTokenField.inputPlaceholder).to.equal(
        '••••••••••••••••••••',
        'Personal access token not installed',
      );

      await percySnapshot(this.test.fullTitle());
    });

    it('validates the gitlab personal access token field correctly', async function() {
      expect(GitlabSettings.isGitlabHostFieldVisible, 'Host field is not visible').to.eq(true);
      await GitlabSettings.integrationSettings.gitlabHostField.fillIn('httpd://gitlab.percy.io');
      await percySnapshot(this.test.fullTitle());
    });

    it('validates the gitlab host field correctly', async function() {
      expect(GitlabSettings.isGitlabHostFieldVisible, 'Host field is not visible').to.eq(true);
      expect(
        GitlabSettings.isPersonalAccessTokenFieldVisible,
        'Personal access token field not visible',
      ).to.eq(true);
      await GitlabSettings.integrationSettings.personalAccessTokenField.fillIn('wrong');
      await GitlabSettings.integrationSettings.gitlabHostField.fillIn('httpd://gitlab.percy.io');
      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('without an existing self-hosted gitlab integration', function() {
    beforeEach(async function() {
      const user = make('user');
      const organization = make('organization', 'withNewGitlabSelfHostedIntegration');
      const gitlabIntegration = organization.get('gitlabSelfHostedIntegration');
      const organizationUser = make('organization-user', 'adminUser', {
        organization: organization,
        user: user,
      });
      organization.set('_filteredOrganizationUsers', [organizationUser]);
      user.set('organizations', [organization]);
      this.setProperties({user, organization, gitlabIntegration});
      await this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
        currentGitlabIntegration=gitlabIntegration
      }}`);
    });

    it('shows the settings form', async function() {
      expect(GitlabSettings.isDeleteButtonDisabled, 'Delete button is disabled').to.eq(false);
      expect(
        GitlabSettings.isPersonalAccessTokenFieldVisible,
        'Personal access token field not visible',
      ).to.eq(true);
      expect(GitlabSettings.integrationSettings.personalAccessTokenField.inputPlaceholder).to.equal(
        'Personal access token',
        'A personal access token has already been installed',
      );
      expect(GitlabSettings.isGitlabHostFieldVisible, 'Host field is not visible').to.eq(true);
      await percySnapshot(this.test.fullTitle());
    });
  });
});
