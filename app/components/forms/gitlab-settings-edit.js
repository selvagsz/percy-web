import BaseFormComponent from './base';
import GitlabSettingsEditValidations from '../../validations/gitlab-settings-edit';

export default BaseFormComponent.extend({
  organization: null,
  classes: null,
  model: null,

  classNames: ['GitlabSettingsEdit', 'Form'],

  validator: GitlabSettingsEditValidations,
});
