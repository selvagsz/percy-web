import {it, describe, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import {make} from 'ember-data-factory-guy';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import GithubEnterpriseSettings from 'percy-web/tests/pages/components/github-enterprise-settings';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: GithubEnterpriseSettings', function() {
  setupRenderingTest('github-enterprise-settings', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    GithubEnterpriseSettings.setContext(this);
  });

  describe('with a github enterprise integration', function() {
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization', 'withGithubEnterpriseIntegration');
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
    });

    it('renders', async function() {
      const isIntegrated = this.get('organization.isGithubEnterpriseIntegrated');
      expect(isIntegrated).to.equal(true);
      await this.render(hbs`{{
        organizations/integrations/github-enterprise-settings
        currentUser=user
        organization=organization
      }}`);
      await percySnapshot(this.test);
    });
  });
});
