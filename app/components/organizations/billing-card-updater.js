import Component from '@ember/component';
import {readOnly} from '@ember/object/computed';
import BillingUpdater from 'percy-web/mixins/billing-updater';

export default Component.extend(BillingUpdater, {
  tagName: '',
  isUpdatingCard: false,

  planId: readOnly('organization.subscription.plan.id'),
  successFlashMessageText: 'Your card was updated successfully!',

  actions: {
    showCardInput() {
      this.set('shouldShowCardInput', true);
    },
  },
});
