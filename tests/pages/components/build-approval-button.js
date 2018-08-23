import {clickable, create, is} from 'ember-cli-page-object';

const SELECTORS = {
  BUTTON: '[data-test-build-approval-button]',
};

export const BuildApprovalButton = {
  clickButton: clickable(SELECTORS.BUTTON),
  isDisabled: is(':disabled', SELECTORS.BUTTON),
};

export default create(BuildApprovalButton);
