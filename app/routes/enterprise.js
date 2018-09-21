import MarketingPageBaseRoute from 'percy-web/routes/marketing-page-base';

import metaTagLookup from 'percy-web/lib/meta-tags';

export default MarketingPageBaseRoute.extend({
  headTags: metaTagLookup('enterprise'),

  beforeModel() {
    if (this.get('launchDarkly').variation('updated-marketing-site')) {
      this.set('templateName', 'new-enterprise');
    }
  },

  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'Enterprise',
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Enterprise Viewed');
    },
  },
});
