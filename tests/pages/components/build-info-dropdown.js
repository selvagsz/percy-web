import {create, clickable, isPresent, text} from 'ember-cli-page-object';

const SELECTORS = {
  ADMIN_DETAILS: '[data-test-build-info-admin-details]',
  BUILD_INFO_DROPDOWN_TOGGLE: '[data-test-build-info-dropdown-toggle]',
  PULL_REQUEST_LABEL: '[data-test-pull-request-label]',
};

export const BuildInfoDropdown = {
  toggleBuildInfoDropdown: clickable(SELECTORS.BUILD_INFO_DROPDOWN_TOGGLE),

  isAdminDetailsPresent: isPresent(SELECTORS.ADMIN_DETAILS),

  pullRequestLabel: {
    scope: SELECTORS.PULL_REQUEST_LABEL,
    text: text(),
  },
};

export default create(BuildInfoDropdown);
