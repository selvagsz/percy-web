import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';

export default Contentful.extend({
  contentType: 'pricingPlanCard',

  name: attr(),
  description: attr(),
  featureList: attr(),
  callToAction: attr(),
  startingPrice: attr(),
});
