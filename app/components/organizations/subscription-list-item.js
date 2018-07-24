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

  subscriptionButtonText: computed('buttonText', 'isActivePlan', function() {
    if (this.get('buttonText')) {
      return this.get('buttonText');
    } else if (this.get('isActivePlan')) {
      return 'Selected Plan';
    } else {
      return 'Select Plan';
    }
  }),

  showCardUpdater() {
    this.set('shouldShowCardInput', true);
  },

  updateExistingSubscription() {
    this.updateSubscription(this.get('planData.id'));
  },

  actions: {
    handleSubscriptionSelection() {
      this.get('organization.subscription');
      if (this.get('isCustom')) {
        return this.get('transitionToEnterpriseForm')();
      } else if (this.get('organization.subscription.isCustomer')) {
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
