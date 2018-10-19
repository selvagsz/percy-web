import Route from '@ember/routing/route';
import metaTagLookup from 'percy-web/lib/meta-tags';

export default Route.extend({
  headTags: metaTagLookup('howItWorks'),
  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'HowItWorks',
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);
      this.analytics.track('How It Works Viewed');
    },
  },
});
