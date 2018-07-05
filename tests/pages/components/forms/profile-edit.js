import {
  fillable,
  value,
  clickable,
  contains,
  isPresent,
  property,
  create,
} from 'ember-cli-page-object';

const SELECTORS = {
  NAME_INPUT: '[data-test-profile-edit-name] input[type=text]',
  EMAIL_INPUT: '[data-test-profile-edit-email] input[type=text]',
  INFO_SUBMIT_BUTTON: '[data-test-profile-edit-submit] [data-test-form-submit-button]',
  UNVERIFIED_EMAIL_MESSAGE: '[data-test-profile-edit-unverified-email-message]',
};

export const ProfileEdit = {
  nameInputContains: value(SELECTORS.NAME_INPUT),
  fillInName: fillable(SELECTORS.NAME_INPUT),

  emailInputContains: value(SELECTORS.EMAIL_INPUT),
  fillInEmail: fillable(SELECTORS.EMAIL_INPUT),

  isSubmitDisabled: property('disabled', SELECTORS.INFO_SUBMIT_BUTTON),
  submitForm: clickable(SELECTORS.INFO_SUBMIT_BUTTON),

  isUnverifiedEmailMessagePresent: isPresent(SELECTORS.UNVERIFIED_EMAIL_MESSAGE),
  unverifiedEmailMessageContains: contains(SELECTORS.UNVERIFIED_EMAIL_MESSAGE),
};

export default create(ProfileEdit);
