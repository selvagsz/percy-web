import {create, text, clickable} from 'ember-cli-page-object';

const SELECTORS = {
  ID: '[data-test-id]',
  DELIVERY_URL: '[data-test-delivery-url]',
  TIMESTAMP: '[data-test-timestamp]',
  STATUS: '[data-test-status-badge]',
  RESPONSE_TIME: '[data-test-response-time]',
  FAILURE_MESSAGE: '[data-test-failure-message]',
  TOGGLE_BUTTON: '[data-test-event-toggle]',
  HEADERS: '[data-test-event-headers]',
  PAYLOAD: '[data-test-event-payload]',
  REQUEST_TAB: '[data-test-request-tab]',
  RESPONSE_TAB: '[data-test-response-tab]',
};

const WebhookEvent = {
  deliveryUrl: text(SELECTORS.DELIVERY_URL),
  id: text(SELECTORS.ID),
  timestamp: text(SELECTORS.TIMESTAMP),
  status: text(SELECTORS.STATUS),
  responseTime: text(SELECTORS.RESPONSE_TIME),
  failureMessage: text(SELECTORS.FAILURE_MESSAGE),

  toggleOpen: clickable(SELECTORS.TOGGLE_BUTTON),

  openRequestTab: clickable(SELECTORS.REQUEST_TAB),
  openResponseTab: clickable(SELECTORS.RESPONSE_TAB),

  headers: text(SELECTORS.HEADERS),
  payload: text(SELECTORS.PAYLOAD),
};

export default create(WebhookEvent);
