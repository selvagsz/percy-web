import {alias} from '@ember/object/computed';
import BaseFormComponent from './base';
import WebhookConfigEditValidations from '../../validations/webhook-config-edit';

export default BaseFormComponent.extend({
  project: null,
  classes: null,

  classNames: ['FormsWebhookConfigEdit', 'Form'],
  classNameBindings: ['classes'],

  model: alias('webhookConfig'),
  validator: WebhookConfigEditValidations,

  allValues: {
    ping: 'Webhook notification settings have been updated',
    build_created: 'A build has been created',
    build_approved: 'A build has been approved',
    build_finished: 'A build has finished',
  },
});
