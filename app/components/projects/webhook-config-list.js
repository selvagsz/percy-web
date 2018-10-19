import Component from '@ember/component';
import {filterBy} from '@ember/object/computed';

export default Component.extend({
  webhookConfigs: null,

  classNames: ['WebhookConfigList'],

  filteredWebhookConfigs: filterBy('webhookConfigs', 'isNew', false),
});
