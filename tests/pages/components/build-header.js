import {create, clickable} from 'ember-cli-page-object';

const SELECTORS = {
  BUILD_HEADER: '[data-test-build-header]',
  SHOW_SUPPORT_LINK: '[data-test-build-overview-show-support]',
};

export const BuildHeader = {
  scope: SELECTORS.BUILD_HEADER,
  clickShowSupport: clickable(SELECTORS.SHOW_SUPPORT_LINK),
};

export default create(BuildHeader);
