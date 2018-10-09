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
});
