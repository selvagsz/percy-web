import {create, isVisible, visitable} from 'ember-cli-page-object';

const SELECTORS = {
  GITHUB_APP_INSTALL_BUTTON: '[data-test-github-app-install-button]',
  GITHUB_APP_LOADING_STATE: '[data-test-github-app-install-loading]',
  GITHUB_APP_SUCCESS_STATE: '[data-test-github-app-install-success]',
};

export const GithubSettings = {
  visitGithubSettings: visitable('/organizations/:orgSlug/integrations/github'),
  isGithubAppInstallButtonVisible: isVisible(SELECTORS.GITHUB_APP_INSTALL_BUTTON),
  isGithubAppLoadingStateVisable: isVisible(SELECTORS.GITHUB_APP_LOADING_STATE),
  isGithubAppSuccessStateVisable: isVisible(SELECTORS.GITHUB_APP_SUCCESS_STATE),
};

export default create(GithubSettings);
