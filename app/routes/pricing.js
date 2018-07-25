import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import {hash} from 'rsvp';

export default Route.extend(ResetScrollMixin, {
  model() {
    return hash({
      cardData: this._getPricingCardData(),
      tableData: this._getFeatureTablePlans(),
      faqData: this._getFaqData(),
    });
  },

  setupController(controller, resolvedModel) {
    controller.setProperties({
      tableData: resolvedModel.tableData,
      smallCard: resolvedModel.cardData.smallCard,
      mediumCard: resolvedModel.cardData.mediumCard,
      largeCard: resolvedModel.cardData.largeCard,
      faqs: resolvedModel.faqData,
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Pricing Viewed');
    },
  },

  _getPricingCardData() {
    return this.store.findAll('pricing-plan-card').then(cards => {
      const smallCard = cards.findBy('id', '4x8tkdOmKsEQ2eKWc68CyS');
      const mediumCard = cards.findBy('id', '3o7cIf5i1aQoMuIkUGwO8K');
      const largeCard = cards.findBy('id', 'bvzQmZjBCwIC4Awa6gwc2');
      return {smallCard, mediumCard, largeCard};
    });
  },

  _getFeatureTablePlans() {
    return this.store.findAll('feature-table-plan').then(allPlans => {
      const smallPlan = allPlans.findBy('id', 'CiiV29doC4YCwe88wegKa');
      const mediumPlan = allPlans.findBy('id', '3oR0vv0jBYsUkuEC24MowK');
      const largePlan = allPlans.findBy('id', '6xpfWhSz7OsyOGgq666SC6');

      const businessPlan = allPlans.findBy('id', '6ov3dA2vbG28gmoe0a2qGw');
      const enterprisePlan = allPlans.findBy('id', 'Ws0cUdIawEmICu2EAYWCu');
      return {
        startupPlans: [smallPlan, mediumPlan, largePlan],
        businessPlan,
        enterprisePlan,
      };
    });
  },

  _getFaqData() {
    return this.store.query('faq', {'fields.page': 'Pricing'}).then(faqs => {
      return faqs.sortBy('order');
    });
  },
});
