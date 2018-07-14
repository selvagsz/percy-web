import Component from '@ember/component';
import {computed} from '@ember/object';
import {readOnly, or, not} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import StripeOptions from 'percy-web/lib/stripe-elements-options';
import {task} from 'ember-concurrency';

// If is free plan, show stripe element thing
//  - on save, update credit card, then update subscription via percy api
// otherwise, update subscription via percy api

export default Component.extend({
  tagName: '',
  subscriptionData: service(),
  subscriptionService: service('subscriptions'),
  store: service(),
  flashMessages: service(),

  options: StripeOptions,
  organization: null,
  plan: null,
  planData: null,
  handleSelection: null,

  isCardComplete: false,
  isUpdatingCard: false,

  isSaveSuccessful: null,

  shouldShowSubmit: readOnly('isCardComplete'),
  shouldShowCardInput: readOnly('isUpdatingCard'),

  isSaving: or('processSubscriptionUpdate.isRunning', 'processCardUpdate.isRunning'),

  processSubscriptionUpdate: task(function*(newPlanId) {
    yield this.get('subscriptionService').changeSubscription.perform(
      this.get('organization'),
      newPlanId,
    );
  }),

  processCardUpdate: task(function*(stripeElement) {
    yield this.get('subscriptionService').updateCreditCard.perform(
      stripeElement,
      this.get('organization'),
      this.get('planData.id'),
    );
  }),

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

  _updateSubscription(newPlanId) {
    this.processSubscriptionUpdate.perform(newPlanId);
  },

  actions: {
    toggleCardInput() {
      this._toggleCardInput();
    },

    checkCard(event, cardDetails) {
      this.set('isCardComplete', cardDetails.complete);
    },

    updateCreditCard(stripeElement) {
      this.processCardUpdate.perform(stripeElement);
    },

    handleSubscriptionSelection(newPlanId) {
      if (this.get('transitionToEnterpriseForm')) {
        this.get('transitionToEnterpriseForm')();
        return;
      }

      if (this.get('creditCardExists')) {
        this._updateSubscription(newPlanId);
      } else {
        this._toggleCardInput();
      }
    },
  },
});
