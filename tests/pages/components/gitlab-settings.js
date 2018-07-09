import {
  attribute,
  create,
  clickable,
  fillable,
  isHidden,
  isVisible,
  text,
} from 'ember-cli-page-object';
import {alias} from 'ember-cli-page-object/macros';

const SELECTORS = {
  GITLAB_INTEGRATION: '[data-test-gitlab-settings]',
  INTEGRATION_CONNECT_BUTTON: '[data-test-gitlab-settings-connect-button]',
  INTEGRATION_SETTINGS_FORM: '[data-test-gitlab-settings-edit-form]',
  PERSONAL_ACCESS_TOKEN_INPUT: '[data-test-gitlab-personal-access-token-field]',
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
      isVisible: isVisible(),
      inputPlaceholder: attribute('placeholder', 'input'),
      inputLabel: attribute('label'),
    },
    toolbar: {
      scope: SELECTORS.INTEGRATION_SETTINGS_TOOLBAR,
      save: clickable(SELECTORS.INTEGRATION_SETTINGS_SAVE_BUTTON),
      isSaveDisabled: attribute('disabled', SELECTORS.INTEGRATION_SETTINGS_SAVE_BUTTON),
      back: clickable('a.back'),
      delete: clickable('button[data-test-gitlab-settings-delete]'),
    },
  },
  integrationButton: {
    scope: SELECTORS.INTEGRATION_CONNECT_BUTTON,
    text: text(),
    isVisible: isVisible(),
  },
  install: clickable(SELECTORS.INTEGRATION_CONNECT_BUTTON),
  delete: alias('integrationSettings.toolbar.delete'),
  statusIsHidden: isHidden(SELECTORS.GITLAB_INTEGRATION),
  isPersonalAccessTokenFieldVisible: alias(
    'integrationSettings.personalAccessTokenField.isVisible',
  ),
};

export default create(GitlabSettings);
