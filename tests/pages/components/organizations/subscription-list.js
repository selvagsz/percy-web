import {create, clickable, collection} from 'ember-cli-page-object';
import {SubscriptionListItem} from 'percy-web/tests/pages/components/organizations/subscription-list-item'; // eslint-disable-line

const SELECTORS = {
  ENTERPRISE_ITEM: '[data-test-subscription-enterprise-item]',
  ENTERPRISE_BUTTON: '[data-test-subscription-list-choose-enterprise]',
  CREATE_SUBSCRIPTION_SUPPORT: '[data-test-create-subscription-support]',
  FREE_PLAN_SUPPORT: '[data-test-free-plan-support]',
  CUSTOM_PLAN_SUPPORT: '[data-test-custom-plan-support]',
  MORE_INFORMATION_SUPPORT: '[data-test-more-information-support]',
};

export const SubscriptionList = {
  listItems: collection({
    itemScope: SubscriptionListItem.scope,
    item: SubscriptionListItem,
  }),

  clickEnterpriseButton: clickable(SELECTORS.ENTERPRISE_BUTTON),
  clickCreateSubscriptionSupport: clickable(SELECTORS.CREATE_SUBSCRIPTION_SUPPORT),
  clickFreePlanSupport: clickable(SELECTORS.FREE_PLAN_SUPPORT),
  clickCustomPlanSupport: clickable(SELECTORS.CUSTOM_PLAN_SUPPORT),
  clickMoreInformationSupport: clickable(SELECTORS.MORE_INFORMATION_SUPPORT),
};

export default create(SubscriptionList);
