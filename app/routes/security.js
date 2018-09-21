import MarketingPageBaseRoute from 'percy-web/routes/marketing-page-base';

export default MarketingPageBaseRoute.extend({
  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Security Policy Viewed');
    },
  },
});
