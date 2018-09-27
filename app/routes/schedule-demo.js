import MarketingPageBaseRoute from 'percy-web/routes/marketing-page-base';
import metaTagLookup from 'percy-web/lib/meta-tags';

export default MarketingPageBaseRoute.extend({
  headTags: metaTagLookup('scheduleDemo'),
  beforeModel() {
    if (!this.get('launchDarkly').variation('updated-marketing-site')) {
      this.transitionTo('/');
    }
  },

  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'ScheduleDemo',
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Schedule Demo Viewed');
    },
  },
});
