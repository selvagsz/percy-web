import {alias, readOnly} from '@ember/object/computed';
import BaseFormComponent from './base';
import ProjectEditValidations from '../../validations/project-edit';

export default BaseFormComponent.extend({
  project: null,

  model: alias('project'),
  validator: ProjectEditValidations,

  isPlanSponsored: readOnly('project.organization.isSponsored'),
});
