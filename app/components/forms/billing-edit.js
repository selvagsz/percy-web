import {alias} from '@ember/object/computed';
import BaseFormComponent from './base';

export default BaseFormComponent.extend({
  subscription: null,

  model: alias('subscription'),
  validator: null,
});
