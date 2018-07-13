import Component from '@ember/component';
import {computed} from '@ember/object';
import {readOnly, not} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import StripeOptions from 'percy-web/lib/stripe-elements-options';

// If is free plan, show stripe element thing
//  - on save, update credit card, then update subscription via percy api
// otherwise, update subscription via percy api

export default Component.extend({
  tagName: '',
  subscriptionData: service(),
  subscriptionService: service('subscriptions'),
  store: service(),
  options: StripeOptions,
  organization: null,
  plan: null,
  planData: null,
  handleSelection: null,

  isCardComplete: false,
  isUpdatingCard: false,

  isSaveSuccessful: null,

  isSaving: readOnly('_updateSubscriptionSavingStatus.isRunning'),
  shouldShowSubmit: readOnly('isCardComplete'),
  shouldShowCardInput: readOnly('isUpdatingCard'),
  planId: readOnly('plan.id'),

  isCustom: computed(function() {
    return this.get('subscriptionData.PLAN_IDS').indexOf(this.get('planData.id')) === -1;
  }),
  isSelected: computed('plan.id', 'planData.id', function() {
    return this.get('plan.id') === this.get('planData.id');
  }),

  selectButtonText: computed('buttonText', 'isSelected', function() {
    if (this.get('buttonText')) {
      return this.get('buttonText');
    } else if (this.get('isSelected')) {
      return 'Selected Plan';
    } else {
      return 'Select Plan';
    }
  }),

  creditCardExists: not('organization.subscription.isTrialOrFree'),

  _toggleCardInput() {
    this.toggleProperty('isUpdatingCard');
  },

  actions: {
    toggleCardInput(){
      this._toggleCardInput();
    },

    checkCard(event, cardDetails) {
      console.log('checking card')
      this.set('isCardComplete', cardDetails.complete);
    },

    updateCreditCard(stripeElement) {
      console.log('updating card')
      this.get('subscriptionService')._updateCreditCard.perform(stripeElement, this.get('organization'), this.get('planData.id'));
      // this.get('subscriptionService').updateCreditCard.perform(stripeElement, this.get('organization'), this.get('planId'));
    },

    handleSubscriptionSelection(selectedPlanId) {
      if (this.get('transitionToEnterpriseForm')) {
        this.get('transitionToEnterpriseForm')();
        return;
      }
      // This is intentionally evaluated here, outside of the handlers below, because password
      // managers like 1Password might strangely change the inputs underneath Stripe Checkout
      // when filling out credit card info.
      // const selectedPlanId = this.get('planData.id');
      const planName = this.get('organization.subscription.plan.name');

      if (this.get('creditCardExists')) {
        console.log('update subscription only');
      } else {
        console.log('show credit card form');
        this._toggleCardInput();
      }
      // if (this.get('creditCardExists')) {
      //   this.toggleCardInput();
      // } else {
      //   const msg = `Ready to change to the ${planName} plan? We'll use your existing payment info.`;
      //   if (confirm(msg)) {
      //     this.get('subscriptionService').updateSomeStuff(this.get('organization'), chosenPlanId);
      //   }
      // }
      // this.toggleProperty('shouldShowCardInput');
      // console.log('choosing one');
    }

  },
});

// lower case snapshot in build info dropdown
// in build info dropdown -- total snapshots: # across all browsers and widths
