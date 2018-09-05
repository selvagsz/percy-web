import {
  attribute,
  create,
  clickable,
  fillable,
  is,
  isHidden,
  isVisible,
  text,
  value,
  visitable,
} from 'ember-cli-page-object';
import {alias} from 'ember-cli-page-object/macros';

const SELECTORS = {
  GITLAB_INTEGRATION: '[data-test-gitlab-settings]',
  INTEGRATION_SETTINGS_FORM: '[data-test-gitlab-settings-edit-form]',
  PERSONAL_ACCESS_TOKEN_INPUT: '[data-test-gitlab-personal-access-token-field]',
  GITLAB_HOST_INPUT: '[data-test-gitlab-host-field]',
  INTEGRATION_SETTINGS_TOOLBAR: '[data-test-gitlab-settings-edit-form-toolbar]',
  INTEGRATION_SETTINGS_SAVE_BUTTON: '[data-test-form-submit-button]',
  INTEGRATION_SETTINGS_DELETE_BUTTON: '[data-test-gitlab-settings-delete]',
};

export const GitlabSettings = {
  scope: SELECTORS.GITLAB_INTEGRATION,
  integrationSettings: {
    scope: SELECTORS.INTEGRATION_SETTINGS_FORM,
    personalAccessTokenField: {
      scope: SELECTORS.PERSONAL_ACCESS_TOKEN_INPUT,
      fillIn: fillable('input'),
      value: value('input'),
      isVisible: isVisible(),
      inputPlaceholder: attribute('placeholder', 'input'),
      inputLabel: text('.label-body'),
    },
    gitlabHostField: {
      scope: SELECTORS.GITLAB_HOST_INPUT,
      fillIn: fillable('input'),
      value: value('input'),
      isVisible: isVisible(),
      inputPlaceholder: attribute('placeholder', 'input'),
      inputLabel: text('.label-body'),
    },
    toolbar: {
      scope: SELECTORS.INTEGRATION_SETTINGS_TOOLBAR,
      save: clickable(SELECTORS.INTEGRATION_SETTINGS_SAVE_BUTTON),
      isSaveDisabled: is(':disabled', SELECTORS.INTEGRATION_SETTINGS_SAVE_BUTTON),
      isDeleteDisabled: is(':disabled', SELECTORS.INTEGRATION_SETTINGS_DELETE_BUTTON),
      back: clickable('a.back'),
      delete: clickable('button[data-test-gitlab-settings-delete]'),
    },
    formError: {
      text: text('.Form-errors'),
      isErrorPresent: isVisible('.Form-errors'),
    },
    integrationName: {
      text: text('[data-test-gitlab-settings-integration-name]'),
    },
  },
  delete: alias('integrationSettings.toolbar.delete'),
  isDeleteButtonDisabled: alias('integrationSettings.toolbar.isDeleteDisabled'),
  isErrorPresent: alias('integrationSettings.formError.isErrorPresent'),
  errorText: alias('integrationSettings.formError.text'),
  integrationName: alias('integrationSettings.integrationName.text'),
  statusIsHidden: isHidden(SELECTORS.GITLAB_INTEGRATION),
  visitSettings: visitable('/organizations/:orgSlug/integrations/:integrationType'),
  isPersonalAccessTokenFieldVisible: alias(
    'integrationSettings.personalAccessTokenField.isVisible',
  ),
  isGitlabHostFieldVisible: alias('integrationSettings.gitlabHostField.isVisible'),
  gitlabHostFieldLabel: alias('integrationSettings.gitlabHostField.inputLabel'),
};

export default create(GitlabSettings);
