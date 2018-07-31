import Component from '@ember/component';
import AdminMode from 'percy-web/lib/admin-mode';
import {computed} from '@ember/object';
import {equal, empty, readOnly} from '@ember/object/computed';
import {inject as service} from '@ember/service';

export default Component.extend({
  subscriptionData: service(),

  classNames: ['OrganizationsBillingSection'],
  classNameBindings: ['classes'],

  organization: null,
  classes: null,

  isSaving: null,
  isSaveSuccessful: null,

  subscription: readOnly('organization.subscription'),

  showCancel: computed('organization.subscription.isCustomer', function() {
    let isCustomer = this.get('organization.subscription.isCustomer');
    return isCustomer && AdminMode.isAdmin();
  }),

  daysInBillingCycle: computed('dayStats', function() {
    const dayStats = this.get('dayStats');
    if (!dayStats) {
      return;
    }

    return this.get('dayStats').length;
  }),

  isUserOrgAdmin: equal('organization.currentUserMembership.role', 'admin'),

  isCurrentUsageStatsLoading: empty('subscription.currentUsageStats'),

  actions: {
    changingSubscription(savingPromise) {
      this.set('isSaveSuccessful', null);
      this.set('isSaving', true);
      savingPromise.then(
        () => {
          this.set('isSaving', false);
          this.set('isSaveSuccessful', true);
        },
        () => {
          this.set('isSaving', false);
          this.set('isSaveSuccessful', false);
        },
      );
    },
    showSupport() {
      this.sendAction('showSupport');
    },
  },
});
