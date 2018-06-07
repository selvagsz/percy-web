import {create, isPresent, is, text, fillable} from 'ember-cli-page-object';

const SELECTORS = {
  GITHUB_SECTION: '[data-test-setup-github-section]',
  GITHUB_USER: '[data-test-setup-github-account]',
  GITHUB_CONNECT_BUTTON: '[data-test-setup-github-connect-button]',
  FORM_SUBMIT_BUTTON: '[data-test-form-submit-button]',
  ORGANIZATION_INPUT: '[data-test-form-input]',
};

export const NewOrganization = {
  hasGithubSection: isPresent(SELECTORS.GITHUB_SECTION),
  hasConnectedGithubAccount: isPresent(SELECTORS.GITHUB_USER),
  hasConnectToGithubButton: isPresent(SELECTORS.GITHUB_CONNECT_BUTTON),
  isCreateNewOrganizationDisabled: is(':disabled', SELECTORS.FORM_SUBMIT_BUTTON),
  githubAccountName: text(SELECTORS.GITHUB_USER),
  organizationName: fillable(SELECTORS.ORGANIZATION_INPUT),
};

export default create(NewOrganization);
