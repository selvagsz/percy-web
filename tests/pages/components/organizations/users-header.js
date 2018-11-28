import {create, isVisible, text} from 'ember-cli-page-object';

const SELECTORS = {
  CONTAINER: '[data-test-users-header]',
  BILLING_PAGE_LINK: '[data-test-billing-link]',
  ORGANIZATION_NAME: '[data-test-organization-name]',
  SHOW_SUPPORT_LINK: '[data-test-users-show-support]',
  SEAT_COUNT_TEXT: '[data-test-seat-count-text]',
};

export const UsersHeader = {
  scope: SELECTORS.CONTAINER,

  organizationName: text(SELECTORS.ORGANIZATION_NAME),
  isBillingLinkVisible: isVisible(SELECTORS.BILLING_PAGE_LINK),
  isSupportLinkVisible: isVisible(SELECTORS.SHOW_SUPPORT_LINK),
  seatCountText: text(SELECTORS.SEAT_COUNT_TEXT),
};

export default create(UsersHeader);
