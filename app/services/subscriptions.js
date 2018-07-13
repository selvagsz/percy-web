import Service, {inject as service} from '@ember/service';
import {task} from 'ember-concurrency';

export default Service.extend({
  store: service(),
  flashMessages: service(),
  stripeService: service('stripev3'),

  _updateCreditCard: task(function*(stripeElement, organization, planId) {
    const stripeResponse = yield this.get('stripeService').createToken(stripeElement);
    this._changeSubscription(organization, planId, stripeResponse);
  }),

  changeSubscription(organization, plan, stripeResponse) {
    // Always create a new POST request to change subscription, don't modify the subscription
    // object directly unless just changing attributes.

    let subscription = this.get('store').createRecord('subscription', {
      organization: organization,
      billingEmail: organization.get('subscription.billingEmail'),
      plan: plan,
      token: stripeResponse && stripeResponse.token.id,
    });
    let savingPromise = subscription.save();

    savingPromise.then(
      () => {},
      () => {
        this.get('flashMessages').createPersistentFlashMessage(
          {
            message:
              'A Stripe error occurred! Your card may have been declined. Please try again or ' +
              'contact us at hello@percy.io and we will help you get set up.',
            type: 'danger',
          },
          {persistentReloads: 1},
        );
        location.reload();
      },
    );
    return savingPromise;
  },

  _changeSubscription(organization, planId, stripeResponse) {
    let plan = this.get('store').peekRecord('plan', planId);
    if (!plan) {
      plan = this.get('store').push({
        data: {
          id: planId,
          type: 'plan',
        },
      });
    }

    this.changeSubscription(organization, plan, stripeResponse);
    // this.get('_updateSubscriptionSavingStatus').perform(savingPromise);
  },
});
