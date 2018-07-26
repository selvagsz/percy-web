import Component from '@ember/component';
import {readOnly} from '@ember/object/computed';
import {inject as service} from '@ember/service';

export default Component.extend({
  subscriptionData: service(),
  organization: null,

  subscription: readOnly('organization.subscription'),
  plan: readOnly('subscription.plan'),

  actions: {
    openIntercom() {
      const messageText = "Hi! I'd like to learn more about upgrading to a larger plan.";

      window.Intercom('showNewMessage', messageText);
    },
  },
});
