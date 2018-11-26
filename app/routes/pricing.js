import Route from '@ember/routing/route';
import {hash} from 'rsvp';
import metaTagLookup from 'percy-web/lib/meta-tags';
import {inject as service} from '@ember/service';
import {computed} from '@ember/object';

export default Route.extend({
  launchDarkly: service(),

  shouldShowNewPage: computed(function() {
    return this.get('launchDarkly').variation('updated-pricing-page');
  }),

  beforeModel() {
    if (this.get('shouldShowNewPage')) {
      this.set('templateName', 'new-pricing');
    }
  },

  model() {
    const showNewPage = this.get('shouldShowNewPage');
    return showNewPage ? this._getV2PricingData() : this._getV1PricingData();
  },

  _getV1PricingData() {
    return hash({
      heroBlock: this._getHeroBlock(),
      cardData: this._getPricingCardData(),
      tableData: this._getFeatureTablePlans(),
      faqData: this._getFaqData(),
    });
  },

  _getV2PricingData() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'Pricing-v2',
    });
  },

  setupController(controller, resolvedModel) {
    if (this.get('shouldShowNewPage')) {
      controller.set('model', resolvedModel);
    } else {
      controller.setProperties({
        heroBlock: resolvedModel.heroBlock,
        tableData: resolvedModel.tableData,
        smallCard: resolvedModel.cardData.smallCard,
        mediumCard: resolvedModel.cardData.mediumCard,
        largeCard: resolvedModel.cardData.largeCard,
        faqs: resolvedModel.faqData,
      });
    }
  },

  headTags: metaTagLookup('pricing'),

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Pricing Viewed');
    },
  },

  _getHeroBlock() {
    return this.get('store')
      .queryRecord('marketing-page', {
        'fields.pageName': 'Pricing',
      })
      .then(marketingPage => {
        return marketingPage
          .get('blocks')
          .findBy('isHero')
          .get('hero');
      });
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
