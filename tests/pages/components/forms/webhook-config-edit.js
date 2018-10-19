import {
  text,
  is,
  collection,
  fillable,
  value,
  clickable,
  property,
  create,
  isPresent,
} from 'ember-cli-page-object';

const SELECTORS = {
  ERRORS: '.Form-errors',
  URL_INPUT: '[data-test-form-input=webhook-config-url]',
  DESCRIPTION_INPUT: '[data-test-form-input=webhook-config-description]',
  AUTH_TOKEN_INPUT: '[data-test-form-input=webhook-config-auth-token]',
  SUBSCRIBED_EVENTS_SET: '[data-test-checkbox-set]',
  SUBSCRIBED_EVENTS_INPUT: '[data-test-checkbox-set-input]',
  CHECKED_SUBSCRIBED_EVENTS_INPUT: '[data-test-checkbox-set-input]:checked',
  SSL_VERIFICATION_ENABLED_INPUT:
    '[data-test-checkbox-input=webhook-config-ssl-verification-enabled]',
  DELIVERY_ENABLED_INPUT: '[data-test-checkbox-input=webhook-config-delivery-enabled]',
  SSL_WARNING: '[data-test-ssl-warning]',
  SUBMIT_BUTTON: '[data-test-form-submit-button]',
};

export const WebhookConfigEdit = {
  errors: text(SELECTORS.ERRORS),

  url: value(SELECTORS.URL_INPUT),
  fillInUrl: fillable(SELECTORS.URL_INPUT),

  description: value(SELECTORS.DESCRIPTION_INPUT),
  fillInDescription: fillable(SELECTORS.DESCRIPTION_INPUT),

  authToken: value(SELECTORS.AUTH_TOKEN_INPUT),
  fillInAuthToken: fillable(SELECTORS.AUTH_TOKEN_INPUT),

  subscribedEvents: collection(SELECTORS.SUBSCRIBED_EVENTS_INPUT, {
    value: is(':checked', 'input'),
    click: clickable('input'),
  }),

  sslVerificationEnabled: value(SELECTORS.SSL_VERIFICATION_ENABLED_INPUT),
  clickSslVerificationEnabled: clickable(SELECTORS.SSL_VERIFICATION_ENABLED_INPUT),
  sslWarningPresent: isPresent(SELECTORS.SSL_WARNING),

  deliveryEnabled: value(SELECTORS.DELIVERY_ENABLED_INPUT),
  clickDeliveryEnabled: clickable(SELECTORS.DELIVERY_ENABLED_INPUT),

  isSubmitDisabled: property('disabled', SELECTORS.SUBMIT_BUTTON),
  submitForm: clickable(SELECTORS.SUBMIT_BUTTON),
};

export default create(WebhookConfigEdit);
