import Component from '@ember/component';
import {computed} from '@ember/object';
import {not} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import BillingUpdater from 'percy-web/mixins/billing-updater';

export default Component.extend(BillingUpdater, {
  tagName: '',
  subscriptionData: service(),
  planData: null,
  isActive: null,
  shouldShowCardInput: false,
  successFlashMessageText: 'Your plan was updated successfully!',

  isCustom: computed('subscriptionData.@each.PLAN_IDS', 'planData.id', function() {
    return this.get('subscriptionData.PLAN_IDS').indexOf(this.get('planData.id')) === -1;
  }),

  isNotSaving: not('isSaving'),

  subscriptionButtonText: computed('isActivePlan', function() {
    return this.get('isActivePlan') ? 'Selected Plan' : 'Select Plan';
  }),

  showCardUpdater() {
    this.set('shouldShowCardInput', true);
  },

  updateExistingSubscription() {
    this.updateSubscription(this.get('planData.id'));
  },

  actions: {
    handleSubscriptionSelection() {
      if (this.get('organization.subscription.isCustomer')) {
        return this.updateExistingSubscription();
      } else {
        this.showCardUpdater();
      }
    },

    hideCardInput() {
      this.set('shouldShowCardInput', false);
    },
  },
});
