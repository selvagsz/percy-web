import {create, clickable, is, isVisible} from 'ember-cli-page-object';

const SELECTORS = {
  GITHUB_INTEGRATION: '[data-test-github-settings]',
  NEEDS_IDENTITY: '[data-test-github-integration-no-github-identity]',
  INTEGRATION_STATUS_MESSAGE: '[data-test-github-settings-status]',
  INTEGRATION_BUTTON: '[data-test-github-settings-connect-button]',
  SETTINGS_FORM: '[data-test-github-settings-form]',
  NO_ACCESS_RADIO_BUTTON: '.data-test-github-settings-no-access-radio',
  ACCESS_PROVIDED_RADIO_BUTTON: '.data-test-github-settings-access-provided-radio',
};

export const GitlabSettings = {
  scope: SELECTORS.GITHUB_INTEGRATION,
  isNeedsIdentityMessageVisible: isVisible(SELECTORS.NEEDS_IDENTITY),

  isGithubSettingsFormVisible: isVisible(SELECTORS.SETTINGS_FORM),

  isNoAccessRadioButtonSelected: is(':checked', SELECTORS.NO_ACCESS_RADIO_BUTTON),
  isAccessProvidedRadioButtonSelected: is(':checked', SELECTORS.ACCESS_PROVIDED_RADIO_BUTTON),

  clickIntegrateGithubRadio: clickable(SELECTORS.ACCESS_PROVIDED_RADIO_BUTTON),
};

export default create(GitlabSettings);
