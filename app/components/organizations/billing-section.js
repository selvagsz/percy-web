import Component from '@ember/component';
import AdminMode from 'percy-web/lib/admin-mode';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  subscriptionData: service(),

  classNames: ['OrganizationsBillingSection'],
  classNameBindings: ['classes'],

  organization: null,
  classes: null,

  isSaving: null,
  isSaveSuccessful: null,

  showCancel: computed('organization.subscription.isCustomer', function() {
    let isCustomer = this.get('organization.subscription.isCustomer');
    return isCustomer && AdminMode.isAdmin();
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
