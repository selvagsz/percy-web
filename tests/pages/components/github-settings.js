import {create, clickable, isVisible, visitable} from 'ember-cli-page-object';

const SELECTORS = {
  GITHUB_APP_ACCESS: '[data-test-github-app-access]',
  GITHUB_APP_INSTALL_BUTTON: '[data-test-github-app-install-button]',
  GITHUB_APP_LOADING_STATE: '[data-test-github-app-install-loading]',
  GITHUB_APP_SUCCESS_STATE: '[data-test-github-app-install-success]',
};

export const GithubSettings = {
  visitGithubSettings: visitable('/organizations/:orgSlug/integrations/github'),
  isGithubAppInstallButtonVisible: isVisible(SELECTORS.GITHUB_APP_INSTALL_BUTTON),
  isGithubAppLoadingStateVisable: isVisible(SELECTORS.GITHUB_APP_LOADING_STATE),
  isGithubAppSuccessStateVisable: isVisible(SELECTORS.GITHUB_APP_SUCCESS_STATE),
  clickGithubAccess: clickable(SELECTORS.GITHUB_APP_ACCESS),
};

export default create(GithubSettings);
