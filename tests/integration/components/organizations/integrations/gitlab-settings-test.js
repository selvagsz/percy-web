import {it, describe, beforeEach, afterEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {make} from 'ember-data-factory-guy';
import AdminMode from 'percy-web/lib/admin-mode';
import GitlabSettings from 'percy-web/tests/pages/components/gitlab-settings';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: GitLab Settings', function() {
  let isAdminModeEnabled;
  setupComponentTest('gitlab-settings', {
    integration: true,
  });

  beforeEach(function() {
    isAdminModeEnabled = this.get('isAdminEnabled');
    AdminMode.setAdminMode();
    setupFactoryGuy(this.container);
    GitlabSettings.setContext(this);
  });

  afterEach(function() {
    this.set('isAdminEnabled', isAdminModeEnabled);
  });

  describe('with a gitlab integration', function() {
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization', 'withGitlabIntegration');
      const organizationUser = make('organization-user', 'adminUser', {organization, user});
      organization.set('_filteredOrganizationUsers', [organizationUser]);
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
    });

    it('shows the settings form', function() {
      this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
      }}`);
      expect(GitlabSettings.isPersonalAccessTokenFieldVisible).to.eq(true);
      percySnapshot(this.test.fullTitle());
    });

    it('validates the personal access token field', function() {
      this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
      }}`);
      GitlabSettings.integrationSettings.personalAccessTokenField.fillIn('wrong');
      percySnapshot(this.test.fullTitle());
    });
  });

  describe('without a gitlab integration', function() {
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization');
      const organizationUser = make('organization-user', 'adminUser', {
        organization: organization,
        user: user,
      });
      organization.set('_filteredOrganizationUsers', [organizationUser]);
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
    });

    it('shows the connect integration button', function() {
      this.render(hbs`{{
        organizations/integrations/gitlab-settings
        currentUser=user
        organization=organization
      }}`);
      expect(GitlabSettings.statusIsHidden).to.equal(true);
      expect(GitlabSettings.integrationButton.isVisible, 'integration button not visible').to.eq(
        true,
      );
      expect(GitlabSettings.integrationButton.text).to.eq('Connect to GitLab');
      percySnapshot(this.test.fullTitle());
    });
  });
});
