import {create, text, isHidden} from 'ember-cli-page-object';

const SELECTORS = {
  GITHUB_ENTERPRISE_INTEGRATION: '[data-test-github-enterprise-settings]',
  INTEGRATION_STATUS_MESSAGE: '[data-test-github-enterprise-settings-status]',
};

export const GithubEnterpriseSettings = {
  scope: SELECTORS.GITHUB_ENTERPRISE_INTEGRATION,
  integrationMessage: text(SELECTORS.INTEGRATION_STATUS_MESSAGE),
  statusIsHidden: isHidden(SELECTORS.GITHUB_ENTERPRISE_INTEGRATION),
};

export default create(GithubEnterpriseSettings);
