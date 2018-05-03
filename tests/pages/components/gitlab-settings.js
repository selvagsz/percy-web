import {create, text, isHidden, isVisible} from 'ember-cli-page-object';

const SELECTORS = {
  GITLAB_INTEGRATION: '[data-test-gitlab-settings]',
  INTEGRATION_STATUS_MESSAGE: '[data-test-gitlab-settings-status]',
  INTEGRATION_BUTTON: '[data-test-gitlab-settings-connect-button]',
};

export const GitlabSettings = {
  scope: SELECTORS.GITLAB_INTEGRATION,
  integrationMessage: text(SELECTORS.INTEGRATION_STATUS_MESSAGE),
  integrationButton: {
    scope: SELECTORS.INTEGRATION_BUTTON,
    text: text(),
    isVisible: isVisible(),
  },
  statusIsHidden: isHidden(SELECTORS.GITLAB_INTEGRATION),
};

export default create(GitlabSettings);
