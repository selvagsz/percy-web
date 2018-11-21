import Component from '@ember/component';
import {filterBy} from '@ember/object/computed';

export default Component.extend({
  projects: null,
  isSidebarVisible: false,

  enabledProjects: filterBy('projects', 'isEnabled', true),
  archivedProjects: filterBy('projects', 'isDisabled', true),
  actions: {
    toggleSidebar() {
      this.toggleProperty('isSidebarVisible');
    },
  },
});
