import BaseFormComponent from './base';
import GitlabSettingsEditValidations from '../../validations/gitlab-settings-edit';
import {alias, or} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import {computed} from '@ember/object';

export default BaseFormComponent.extend({
  classes: null,

  organization: null,
  currentGitlabIntegration: null,
  model: alias('currentGitlabIntegration'),

  session: service(),
  currentUser: alias('session.currentUser'),

  isSelfHosted: alias('currentGitlabIntegration.isGitlabSelfHostedIntegration'),
  gitlabHost: alias('currentGitlabIntegration.gitlabHost'),

  validator: GitlabSettingsEditValidations,

  isGitlabPersonalAccessTokenPresent: alias('model.isGitlabPersonalAccessTokenPresent'),
  gitlabPersonalAccessToken: alias('model.gitlabPersonalAccessToken'),
  gitlabPersonalAccessTokenPlaceholder: computed('isGitlabPersonalAccessTokenPresent', function() {
    if (this.get('isGitlabPersonalAccessTokenPresent')) {
      return '••••••••••••••••••••';
    } else {
      return 'Personal access token';
    }
  }),

  isSubmitDisabled: or('changeset.isInvalid', 'changeset.isPristine'),
});
