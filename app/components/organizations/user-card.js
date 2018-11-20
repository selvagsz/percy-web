import {computed} from '@ember/object';
import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  organizationUser: null,

  session: service(),
  currentUser: alias('session.currentUser'),
  isAdmin: alias('organizationUser.organization.currentUserIsAdmin'),
  isCurrentUser: computed('currentUser.id', 'organizationUser.user.id', function() {
    return this.get('currentUser.id') === this.get('organizationUser.user.id');
  }),
  deleteTextName: computed(function() {
    if (this.get('isCurrentUser')) {
      return 'yourself';
    } else {
      return this.get('organizationUser').user.name;
    }
  }),
  role: computed('organizationUser.role', function() {
    return this.get('organizationUser.role');
  }),
  roleTitle: computed('organizationUser.roleTitle', function() {
    return this.get('organizationUser.roleTitle');
  }),
  actions: {
    removeUser() {
      const name = this.get('deleteTextName');
      const conf = confirm(`Are you sure you want to remove ${name} from this organization?`);
      if (!conf) {
        return;
      }
      this.get('organizationUser').destroyRecord();
    },
    setRole(value) {
      const organizationUser = this.get('organizationUser');
      organizationUser.set('role', value);
      organizationUser.save();
    },
  },
});
