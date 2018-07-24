import Mixin from '@ember/object/mixin';
import {inject as service} from '@ember/service';
import {readOnly} from '@ember/object/computed';
import StripeOptions from 'percy-web/lib/stripe-elements-options';
import {task} from 'ember-concurrency';

var BillingUpdater = Mixin.create({
  subscriptionService: service('subscriptions'),
  stripeService: service('stripev3'),
  store: service(),
  flashMessages: service(),

  _isCardComplete: false,

  // for external consumption
  options: StripeOptions,
  shouldShowSubmit: readOnly('_isCardComplete'),
  shouldShowCardInput: false,
  isSaveSuccessful: null,
  isSaving: readOnly('_updateSubscriptionSavingStatus.isRunning'),

  actions: {
    checkCard(event, cardDetails) {
      this.set('_isCardComplete', cardDetails.complete);
    },

    updateCreditCard(stripeElement, planId) {
      this.get('_updateCreditCard').perform(stripeElement, planId);
    },
  },

  updateSubscription(planId, token) {
    const organization = this.get('organization');
    const subscriptionService = this.get('subscriptionService');

    const savingPromise = subscriptionService.changeSubscription(organization, planId, token);
    this.get('_updateSubscriptionSavingStatus').perform(savingPromise);
  },

  _updateCreditCard: task(function*(stripeElement, planId) {
    const response = yield this.get('stripeService').createToken(stripeElement);
    this.updateSubscription(planId, response.token);
  }),

  _updateSubscriptionSavingStatus: task(function*(savingPromise) {
    this.set('isSaveSuccessful', null);
    const flashMessageText = this.get('successFlashMessageText') || 'Success';
    try {
      yield savingPromise;
      this.get('flashMessages').success(flashMessageText);
      this.setProperties({
        isSaveSuccessful: true,
        _isCardComplete: false,
        shouldShowCardInput: false,
      });
    } catch (e) {
      this.set('isSaveSuccessful', false);
      this.set('shouldShowCardInput', false);
    }
  }),
});

export default BillingUpdater;
