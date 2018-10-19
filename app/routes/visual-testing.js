import Route from '@ember/routing/route';
import metaTagLookup from 'percy-web/lib/meta-tags';

export default Route.extend({
  headTags: metaTagLookup('visualTesting'),
  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'VisualTesting',
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);
      this.analytics.track('Visual Testing Viewed');
    },
  },
});
