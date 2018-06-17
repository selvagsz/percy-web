import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {make} from 'ember-data-factory-guy';
import GithubSettings from 'percy-web/tests/pages/components/github-settings';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: GitHub Settings', function() {
  setupComponentTest('github-settings', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    GithubSettings.setContext(this);
  });

  describe('When user has Github Identity', function() {
    beforeEach(function() {
      const user = make('user', 'withGithubIdentity');
      const organization = make('organization');
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
    });

    it('offers installation options when integration has not been installed', async function() {
      this.render(hbs`{{
        organizations/integrations/github-settings
        currentUser=user
        organization=organization
      }}`);

      expect(GithubSettings.isGithubSettingsFormVisible, 'one').to.equal(true);
      expect(GithubSettings.isNoAccessRadioButtonSelected, 'two').to.equal(true);
      expect(GithubSettings.isAccessProvidedRadioButtonSelected, 'trhee').to.equal(false);
      percySnapshot(this.test.fullTitle());
      await GithubSettings.clickIntegrateGithubRadio();

      expect(GithubSettings.isNoAccessRadioButtonSelected).to.equal(false);
      expect(GithubSettings.isAccessProvidedRadioButtonSelected).to.equal(true);
      percySnapshot(this.test.fullTitle());
    });

    it('shows that the integration is installed', function() {
      this.set('organization', make('organization', 'withGithubIntegration'));
      this.render(hbs`{{
        organizations/integrations/github-settings
        currentUser=user
        organization=organization
        isEligibleForGithubIntegration=true
      }}`);

      expect(GithubSettings.isGithubSettingsFormVisible).to.equal(true);
      expect(GithubSettings.isNoAccessRadioButtonSelected).to.equal(false);
      expect(GithubSettings.isAccessProvidedRadioButtonSelected).to.equal(true);
      percySnapshot(this.test.fullTitle());
    });
  });

  describe('when user has no Github identity', function() {
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization');
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
    });

    it('offers installation options when integration hasn to been installed', function() {
      this.render(hbs`{{
        organizations/integrations/github-settings
        currentUser=user
        organization=organization
        isEligibleForGithubIntegration=false
      }}`);

      expect(GithubSettings.isGithubSettingsFormVisible).to.equal(false);
      expect(GithubSettings.isNeedsIdentityMessageVisible).to.equal(true);
      percySnapshot(this.test.fullTitle());
    });
  });
});
