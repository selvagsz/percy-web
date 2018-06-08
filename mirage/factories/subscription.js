import moment from 'moment';
import {Factory} from 'ember-cli-mirage';

export default Factory.extend({
  billingEmail(i) {
    return `billing-email-${i}@example.com`;
  },
  currentPeriodStart() {
    return moment('2020-01-15');
  },
  currentPeriodEnd() {
    return moment('2020-02-15');
  },

  afterCreate(subscription, server) {
    let currentUsageStats = server.create('usageStat');
    subscription.update({currentUsageStats});

    if (!subscription.plan) {
      let plan = server.create('plan');
      subscription.update({plan});
    }
  },
});
