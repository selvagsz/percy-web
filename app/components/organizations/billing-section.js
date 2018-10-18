import Component from '@ember/component';
import AdminMode from 'percy-web/lib/admin-mode';
import {computed} from '@ember/object';
import {equal, readOnly} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import {task} from 'ember-concurrency';

export default Component.extend({
  subscriptionData: service(),
  store: service(),

  classNames: ['OrganizationsBillingSection'],

  isSaving: null,
  isSaveSuccessful: null,
  organization: null,

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

  currentUsageStats: computed('organization.subscription', function() {
    return this.get('getUsageStats').perform();
  }),

  getUsageStats: task(function*() {
    const organization = yield this.get('store').findRecord(
      'organization',
      this.get('organization.id'),
      {
        reload: true,
        include: 'subscription.current-usage-stats',
      },
    );
    return organization.get('subscription.currentUsageStats');
  }),

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
