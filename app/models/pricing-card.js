import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';

export default Contentful.extend({
  contentType: 'pricingCard',

  name: attr(),
  subheader: attr(),
  mainContent: attr(),
  startingPrice: attr(),
  cta: attr(),
  ctaLink: attr(),
  finePrint: attr(),
  classes: attr(),
  color: attr(),
});
