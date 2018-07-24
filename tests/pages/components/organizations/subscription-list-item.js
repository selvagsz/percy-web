import {create, is, clickable, text, isVisible} from 'ember-cli-page-object';

const SELECTORS = {
  SUBSCRIPTION_LIST_ITEM: '[data-test-subscription-list-item]',
  SELECT_PLAN_BUTTON: '[data-test-subscription-list-item-choose-subscription]',
  STRIPE_CARD_COMPONENT: '[data-test-subscription-list-item-stripe-card]',
};

export const GithubEnterpriseSettings = {
  scope: SELECTORS.SUBSCRIPTION_LIST_ITEM,

  clickSelectPlanButton: clickable(SELECTORS.SELECT_PLAN_BUTTON),
  isSelectPlanButtonDisabled: is(':disabled', SELECTORS.SELECT_PLAN_BUTTON),
  selectPlanButtonText: text(SELECTORS.SELECT_PLAN_BUTTON),
  isStripeCardComponentVisible: isVisible(SELECTORS.STRIPE_CARD_COMPONENT),
};

export default create(GithubEnterpriseSettings);
