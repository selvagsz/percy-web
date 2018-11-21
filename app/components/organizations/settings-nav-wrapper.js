import Component from '@ember/component';
import {readOnly, filterBy} from '@ember/object/computed';

export default Component.extend({
  organization: null,

  projects: readOnly('organization.projects'),
  enabledProjects: filterBy('projects', 'isEnabled', true),
  archivedProjects: filterBy('projects', 'isDisabled', true),
});
