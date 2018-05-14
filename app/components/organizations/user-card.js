import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  organizationUser: null,

  session: service(),
  currentUser: alias('session.currentUser'),

  isExpanded: false,
  actions: {
    toggleExpanded() {
      this.toggleProperty('isExpanded');
    },
  },
});
