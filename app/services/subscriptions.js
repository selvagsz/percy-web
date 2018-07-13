import Service, {inject as service} from '@ember/service';
import {task} from 'ember-concurrency';

export default Service.extend({
  store: service(),
  flashMessages: service(),
  stripeService: service('stripev3'),

  updateCreditCard: task(function*(stripeElement, organization, planId) {
    const stripeResponse = yield this.get('stripeService').createToken(stripeElement);
    return this.changeSubscription(organization, planId, stripeResponse.token);
  }),

  changeSubscription(organization, planId, token) {
    // Always create a new POST request to change subscription, don't modify the subscription
    // object directly unless just changing attributes.
    let subscription = this.get('store').createRecord('subscription', {
      organization: organization,
      billingEmail: organization.get('subscription.billingEmail'),
      plan: this._get_or_create_plan(planId),
      token: token && token.id,
    });

    let savingPromise = subscription.save();

    savingPromise.then(
      // success -- handle success in component
      () => {},
      // failure. Generic handler, but can add additional handling in component.
      () => {
        this.get('flashMessages').createPersistentFlashMessage({
          message:
            'A Stripe error occurred! Your card may have been declined. Please try again or ' +
            'contact us at hello@percy.io and we will help you get set up.',
          type: 'danger',
        });
      },
    );

    return savingPromise;
  },

  _get_or_create_plan(planId) {
    let plan = this.get('store').peekRecord('plan', planId);
    if (!plan) {
      plan = this.get('store').push({
        data: {
          id: planId,
          type: 'plan',
        },
      });
    }
    return plan;
  },
});
