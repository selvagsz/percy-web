import {readOnly} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {task} from 'ember-concurrency';

export default Component.extend({
  classNames: ['OrganizationsSwitcherNav'],
  store: service(),
  session: service(),

  isExpanded: false,

  currentUser: readOnly('session.currentUser'),
  isOrganizationsLoading: readOnly('_getUserOrganizations.isRunning'),
  userOrganizations: null,

  _getUserOrganizations: task(function*() {
    const user = yield this.get('session').forceReloadUser();
    const userOrganizations = yield this.get('store').query('organization', {user});
    this.setProperties({userOrganizations});
  }),

  actions: {
    toggleSwitcher() {
      this._getUserOrganizations.perform();
      this.toggleProperty('isExpanded');
    },

    hideSwitcher() {
      this.set('isExpanded', false);
    },
  },
});
