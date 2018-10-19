import Component from '@ember/component';
import {readOnly} from '@ember/object/computed';
import {inject as service} from '@ember/service';

export default Component.extend({
  subscriptionData: service(),
  intercom: service(),
  organization: null,

  subscription: readOnly('organization.subscription'),
  plan: readOnly('subscription.plan'),

  actions: {
    showSupport() {
      this.get('intercom').showIntercom();
    },

    showSupportTargeted() {
      const messageText = "Hi! I'd like to learn more about upgrading to a larger plan.";
      this.get('intercom').showIntercom('showNewMessage', messageText);
    },
  },
});
