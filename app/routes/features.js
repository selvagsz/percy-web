import MarketingPageBaseRoute from 'percy-web/routes/marketing-page-base';

export default MarketingPageBaseRoute.extend({
  beforeModel() {
    if (!this.get('launchDarkly').variation('updated-marketing-site')) {
      this.transitionTo('/');
    }
  },

  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'Features',
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Features Viewed');
    },
  },
});
