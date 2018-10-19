import {text, create, collection, clickable} from 'ember-cli-page-object';

const SELECTORS = {
  WEBHOOK_CONFIG_LIST: '[data-test-webhook-config-list]',
  WEBHOOK_CONFIG_ITEM: '[data-test-webhook-config-item]',
  NEW_WEBHOOK_CONFIG_BUTTON: '[data-test-new-webhook-config]',
};

export const WebhookConfigList = {
  scope: SELECTORS.WEBHOOK_CONFIG_LIST,

  webhookConfigs: collection({
    itemScope: SELECTORS.WEBHOOK_CONFIG_ITEM,
    item: {
      url: text('[data-test-webhook-config-url]'),
    },
  }),

  newWebhookConfig: clickable('button'),
};

export default create(WebhookConfigList);
