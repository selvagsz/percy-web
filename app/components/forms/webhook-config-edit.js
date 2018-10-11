import {computed} from '@ember/object';
import BaseFormComponent from './base';
import WebhookConfigEditValidations from '../../validations/webhook-config-edit';

export default BaseFormComponent.extend({
  project: null,
  classes: null,

  classNames: ['FormsWebhookConfigEdit', 'Form'],
  classNameBindings: ['classes'],

  model: computed.alias('webhookConfig'),
  validator: WebhookConfigEditValidations,

  saveText: computed('changeset.isPristine', function() {
    return `${this.changeset.get('isNew') ? 'Create' : 'Update'} webhook`;
  }),

  allValues: {
    ping: 'Webhook notification settings have been updated',
    build_created: 'A build has been created',
    build_approved: 'A build has been approved',
    build_finished: 'A build has finished',
  },
});
