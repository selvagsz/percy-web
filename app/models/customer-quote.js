import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';
import {belongsTo} from 'ember-data/relationships';

export default Contentful.extend({
  contentType: 'customerQuote',

  customerName: attr(),
  customerQuote: attr(),
  quoteAttribution: attr(),
  headshot: belongsTo('contentful-asset'), // model here: https://bit.ly/2MoN7fD
  logo: belongsTo('contentful-asset'), // model here: https://bit.ly/2MoN7fD
  type: attr(),
});
