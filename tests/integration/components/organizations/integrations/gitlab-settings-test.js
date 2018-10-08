import {it, describe, beforeEach, afterEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {make} from 'ember-data-factory-guy';
import AdminMode from 'percy-web/lib/admin-mode';
import GitlabSettings from 'percy-web/tests/pages/components/gitlab-settings';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import sinon from 'sinon';

describe('Integration: GitlabSettings', function() {
  let isAdminModeEnabled;
  setupComponentTest('gitlab-settings', {
    integration: true,
  });

  beforeEach(function() {
    isAdminModeEnabled = this.get('isAdminEnabled');
    AdminMode.setAdminMode();
    setupFactoryGuy(this.container);
    GitlabSettings.setContext(this);
    const routeHelperStub = sinon.stub();
    this.set('actions', {redirectToIntegrationsIndex: routeHelperStub});
  });

  afterEach(function() {
    this.set('isAdminEnabled', isAdminModeEnabled);
  });

  describe('with a gitlab integration', function() {
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization', 'withGitlabIntegration');
      const gitlabIntegration = organization.get('gitlabIntegration');
      const organizationUser = make('organization-user', 'adminUser', {organization, user});
      organization.set('_filteredOrganizationUsers', [organizationUser]);
      user.set('organizations', [organization]);
      this.setProperties({user, organization, gitlabIntegration});
      this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
        currentGitlabIntegration=gitlabIntegration
      }}`);
    });

    it('shows the settings form', function() {
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

      percySnapshot(this.test.fullTitle());
    });

    it('validates the personal access token field', function() {
      GitlabSettings.integrationSettings.personalAccessTokenField.fillIn('wrong');
      percySnapshot(this.test.fullTitle());
    });

    it('does not show the firewall contact link', function() {
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
    beforeEach(function() {
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
      this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
        currentGitlabIntegration=gitlabIntegration
      }}`);
    });

    it('shows the settings form', function() {
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
      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a gitlab self-hosted integration', function() {
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization', 'withGitlabSelfHostedIntegration');
      const gitlabIntegration = organization.get('gitlabSelfHostedIntegration');
      const organizationUser = make('organization-user', 'adminUser', {organization, user});
      organization.set('_filteredOrganizationUsers', [organizationUser]);
      user.set('organizations', [organization]);
      this.setProperties({user, organization, gitlabIntegration});
      this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
        currentGitlabIntegration=gitlabIntegration
      }}`);
    });

    it('shows the firewall contact link', function() {
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
    });

    it('shows the settings form', function() {
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

      percySnapshot(this.test.fullTitle());
    });

    it('validates the gitlab personal access token field correctly', function() {
      expect(GitlabSettings.isGitlabHostFieldVisible, 'Host field is not visible').to.eq(true);
      GitlabSettings.integrationSettings.gitlabHostField.fillIn('httpd://gitlab.percy.io');
      percySnapshot(this.test.fullTitle());
    });

    it('validates the gitlab host field correctly', function() {
      expect(GitlabSettings.isGitlabHostFieldVisible, 'Host field is not visible').to.eq(true);
      expect(
        GitlabSettings.isPersonalAccessTokenFieldVisible,
        'Personal access token field not visible',
      ).to.eq(true);
      GitlabSettings.integrationSettings.personalAccessTokenField.fillIn('wrong');
      GitlabSettings.integrationSettings.gitlabHostField.fillIn('httpd://gitlab.percy.io');
      percySnapshot(this.test.fullTitle());
    });
  });

  describe('without an existing self-hosted gitlab integration', function() {
    beforeEach(function() {
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
      this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
        currentGitlabIntegration=gitlabIntegration
      }}`);
    });

    it('shows the settings form', function() {
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
      percySnapshot(this.test.fullTitle());
    });
  });
});
