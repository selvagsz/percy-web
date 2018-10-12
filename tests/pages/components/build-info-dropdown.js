import {create, isPresent, text} from 'ember-cli-page-object';
import clickDropdownTrigger from 'percy-web/tests/pages/helpers/click-basic-dropdown-trigger';

const SELECTORS = {
  ADMIN_DETAILS: '[data-test-build-info-admin-details]',
  BUILD_INFO_DROPDOWN_TOGGLE: '[data-test-build-info-dropdown-toggle]',
  PULL_REQUEST_LABEL: '[data-test-pull-request-label]',
  BASE_BUILD: '.data-test-baseline-build-link',
};

export const BuildInfoDropdown = {
  toggleBuildInfoDropdown() {
    // position dropdown near left side of screen
    clickDropdownTrigger('', {top: '120px', left: '40px'});
  },

  isAdminDetailsPresent: isPresent(SELECTORS.ADMIN_DETAILS, {
    resetScope: true,
    testContainer: '#ember-testing-container',
  }),

  pullRequestLabelText: text(SELECTORS.PULL_REQUEST_LABEL, {
    resetScope: true,
    testContainer: '#ember-testing-container',
  }),

  clickBaseBuild() {
    return click(SELECTORS.BASE_BUILD);
  },
};

export default create(BuildInfoDropdown);
