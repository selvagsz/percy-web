import {alias} from '@ember/object/computed';
import BaseFormComponent from './base';
import OrganizationEditValidations from '../../validations/organization-edit';

export default BaseFormComponent.extend({
  organization: null,
  classes: null,

  model: alias('organization'),
  validator: OrganizationEditValidations,
});
