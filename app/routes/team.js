import MarketingPageBaseRoute from 'percy-web/routes/marketing-page-base';
import metaTagLookup from 'percy-web/lib/meta-tags';

export default MarketingPageBaseRoute.extend({
  headTags: metaTagLookup('team'),

  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'Team',
    });
  },
});
