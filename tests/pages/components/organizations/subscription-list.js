import {create, clickable, collection} from 'ember-cli-page-object';
import {SubscriptionListItem} from 'percy-web/tests/pages/components/organizations/subscription-list-item'; // eslint-disable-line

const SELECTORS = {
  ENTERPRISE_ITEM: '[data-test-subscription-enterprise-item]',
  ENTERPRISE_BUTTON: '[data-test-subscription-list-choose-enterprise]',
};

export const SubscriptionList = {
  listItems: collection({
    itemScope: SubscriptionListItem.scope,
    item: SubscriptionListItem,
  }),

  clickEnterpriseButton: clickable(SELECTORS.ENTERPRISE_BUTTON),
};

export default create(SubscriptionList);
