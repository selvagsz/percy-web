import {create, clickable, isPresent} from 'ember-cli-page-object';

const SELECTORS = {
  ADMIN_DETAILS: '[data-test-build-info-admin-details]',
  BUILD_INFO_DROPDOWN_TOGGLE: '[data-test-build-info-dropdown-toggle]',
};

export const BuildInfoDropdown = {
  toggleBuildInfoDropdown: clickable(SELECTORS.BUILD_INFO_DROPDOWN_TOGGLE),

  isAdminDetailsPresent: isPresent(SELECTORS.ADMIN_DETAILS),
};

export default create(BuildInfoDropdown);
