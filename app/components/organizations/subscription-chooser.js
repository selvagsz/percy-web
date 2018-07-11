import Component from '@ember/component';
import {readOnly} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import StripeOptions from 'percy-web/lib/stripe-elements-options';

export default Component.extend({
  subscriptionData: service(),

  options: StripeOptions,
  organization: null,

  subscription: readOnly('organization.subscription'),
  plan: readOnly('subscription.plan'),
});
