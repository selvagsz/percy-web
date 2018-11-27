import Route from '@ember/routing/route';
import metaTagLookup from 'percy-web/lib/meta-tags';

export default Route.extend({
  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'Pricing-v2',
    });
  },

  headTags: metaTagLookup('pricing'),

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Pricing Viewed');
    },
  },
});
