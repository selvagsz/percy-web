import {fillable, clickable, property, create} from 'ember-cli-page-object';

const SELECTORS = {
  PASSWORD_INPUT: '[data-test-account-new-password] input[type=password]',
  SUBMIT_BUTTON: '[data-test-account-new-submit] [data-test-form-submit-button]',
};

export const AccountNew = {
  fillInPassword: fillable(SELECTORS.PASSWORD_INPUT),

  isSubmitDisabled: property('disabled', SELECTORS.SUBMIT_BUTTON),
  submitForm: clickable(SELECTORS.SUBMIT_BUTTON),
};

export default create(AccountNew);
