import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {make} from 'ember-data-factory-guy';
import GithubEnterpriseSettings from 'percy-web/tests/pages/components/github-enterprise-settings';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: Github Enterprise Settings', function() {
  setupComponentTest('github-enterprise-settings', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    GithubEnterpriseSettings.setContext(this);
  });

  describe('with a github enterprise integration', function() {
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization', 'withGithubEnterpriseIntegration');
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
    });

    it('shows that the integration is installed', function() {
      const isIntegrated = this.get('organization.isGithubEnterpriseIntegrated');
      expect(isIntegrated).to.equal(true);
      this.render(hbs`{{
        organizations/github-enterprise-settings
        currentUser=user
        organization=organization
      }}`);
      expect(GithubEnterpriseSettings.integrationMessage).to.include('is installed');
      percySnapshot(this.test.fullTitle());
    });
  });

  describe('without a github enterprise integration', function() {
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization');
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
    });

    it('shows nothing', function() {
      const isIntegrated = this.get('organization.isGithubEnterpriseIntegrated');
      expect(isIntegrated).to.equal(false);
      this.render(hbs`{{
        organizations/github-enterprise-settings
        currentUser=user
        organization=organization
      }}`);
      expect(GithubEnterpriseSettings.statusIsHidden).to.equal(true);
      percySnapshot(this.test.fullTitle());
    });
  });
});
