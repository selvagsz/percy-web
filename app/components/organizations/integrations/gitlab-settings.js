import {computed} from '@ember/object';
import {alias, bool} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {GITLAB_INTEGRATION_TYPE} from 'percy-web/models/version-control-integration';

export default Component.extend({
  organization: null,
  model: null,

  store: service(),
  session: service(),
  currentUser: alias('session.currentUser'),
  isGitlabIntegrated: alias('organization.isGitlabIntegrated'),
  gitlabIntegration: alias('organization.gitlabIntegration'),
  isGitlabPersonalAccessTokenPresent: bool('gitlabIntegration.isGitlabPersonalAccessTokenPresent'),
  gitlabPersonalAccessTokenLabel: computed(
    'gitlabIntegration.isGitlabPersonalAccessTokenPresent',
    function() {
      const currentUser = this.get('currentUser');
      const gitlabBotUserId = parseInt(this.get('gitlabIntegration.gitlabBotUserId'));
      const isTokenPresent = this.get('isGitlabPersonalAccessTokenPresent');
      const label = 'Personal access token';
      let installationStatus;
      if (isTokenPresent) {
        if (parseInt(currentUser.id) === gitlabBotUserId) {
          installationStatus = '(installed by you)';
        } else {
          let username = this.get('store')
            .findRecord('user', gitlabBotUserId)
            .get('name');
          if (username) {
            installationStatus = `(installed by ${username})`;
          } else {
            installationStatus = '(installed)';
          }
        }
      } else {
        installationStatus = '(not installed)';
      }
      return `${label} ${installationStatus}`;
    },
  ),
  gitlabPersonalAccessTokenPlaceholder: computed('isGitlabPersonalAccessTokenPresent', function() {
    let isGitlabPersonalAccessTokenPresent = this.get('isGitlabPersonalAccessTokenPresent');
    if (isGitlabPersonalAccessTokenPresent) {
      return '••••••••••••••••••••';
    } else {
      return 'Personal access token';
    }
  }),

  actions: {
    createGitlabIntegration() {
      let organization = this.get('organization');
      let store = this.get('store');
      let versionControlIntegration = store.createRecord('version-control-integration', {
        integrationType: GITLAB_INTEGRATION_TYPE,
        organization: organization,
      });
      return versionControlIntegration.save();
    },
  },
});
