import Component from '@ember/component';
import {readOnly} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import StripeOptions from 'percy-web/lib/stripe-elements-options';

export default Component.extend({
  subscriptionService: service('subscriptions'),
  subscriptionData: service(),
  stripeService: service('stripev3'),
  store: service(),
  // flashMessages: service(),

  // tagName: '',
  options: StripeOptions,

  organization: null,

  subscription: readOnly('organization.subscription'),
  plan: readOnly('subscription.plan'),

  // isCardComplete: false,
  // isUpdatingCard: false,

  // isSaveSuccessful: null,

  // isSaving: readOnly('_updateSubscriptionSavingStatus.isRunning'),
  // shouldShowSubmit: readOnly('isCardComplete'),
  // shouldShowCardInput: readOnly('isUpdatingCard'),
  // planId: readOnly('organization.subscription.plan.id'),

  // actions: {
  //   checkCard(event, cardDetails) {
  //     this.set('isCardComplete', cardDetails.complete);
  //   },

  //   showCardInput() {
  //     this.set('isUpdatingCard', true);
  //   },

  //   updateCreditCard(stripeElement) {
  //     this.get('_updateCreditCard').perform(stripeElement);
  //   },
  // },

  // _updateCreditCard: task(function*(stripeElement) {
  //   const planId = this.get('planId');
  //   const response = yield this.get('stripeService').createToken(stripeElement);
  //   this._changeSubscription(planId, response.token);
  // }),

  // _changeSubscription(planId, token) {
  //   const organization = this.get('organization');
  //   const subscriptionService = this.get('subscriptionService');

  //   // expect organization to have plan if they are able to update card
  //   const plan = this.get('store').peekRecord('plan', planId);

  //   const savingPromise = subscriptionService.changeSubscription(organization, plan, token);
  //   this.get('_updateSubscriptionSavingStatus').perform(savingPromise);
  // },

  // _updateSubscriptionSavingStatus: task(function*(savingPromise) {
  //   this.set('isSaveSuccessful', null);
  //   try {
  //     yield savingPromise;
  //     this.get('flashMessages').success('Your card was updated successfully!');
  //     this.setProperties({
  //       isSaveSuccessful: true,
  //       isUpdatingCard: false,
  //       isCardComplete: false,
  //     });
  //   } catch (e) {
  //     this.set('isSaveSuccessful', false);
  //   }
  // }),
});
