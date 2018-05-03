import {it, describe, beforeEach, afterEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import utils from 'percy-web/lib/utils';
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
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
    });

    it('shows that the integration is installed', function() {
      this.render(hbs`{{
        organizations/gitlab-settings
        currentUser=user
        organization=organization
      }}`);
      expect(GitlabSettings.integrationMessage).to.include('is installed');
      percySnapshot(this.test.fullTitle());
    });
  });

  describe('without a gitlab integration', function() {
    let windowStub;
    beforeEach(function() {
      const user = make('user');
      const organization = make('organization');
      user.set('organizations', [organization]);
      this.setProperties({user, organization});
      windowStub = sinon.stub(utils, 'setWindowLocation');
    });

    afterEach(function() {
      windowStub.restore();
    });

    it('allows the user to connect the integration', function() {
      this.render(hbs`{{
        organizations/gitlab-settings
        currentUser=user
        organization=organization
      }}`);
      expect(GitlabSettings.statusIsHidden).to.equal(true);
      expect(GitlabSettings.integrationButton.isVisible).to.eq(true);
      expect(GitlabSettings.integrationButton.text).to.eq('Connect to GitLab');

      GitlabSettings.integrationButton.click();
      const slug = this.get('organization.slug');
      expect(windowStub).to.have.been.calledWith(`/api/auth/gitlab/redirect/${slug}`);

      percySnapshot(this.test.fullTitle());
    });
  });
});
