import {computed} from '@ember/object';
import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  organizationUser: null,

  session: service(),
  currentUser: alias('session.currentUser'),
  isAdmin: alias('organization.currentUserIsAdmin'),
  isCurrentUser: computed('currentUser.id', 'organizationUser.user.id', function() {
    return this.get('currentUser.id') === this.get('organizationUser.user.id');
  }),
  isExpanded: false,
  actions: {
    toggleExpanded() {
      this.toggleProperty('isExpanded');
    },
  },
});
