import Contentful from 'ember-data-contentful/models/contentful';
import {hasMany} from 'ember-data/relationships';

export default Contentful.extend({
  contentType: 'customerQuoteBlock',

  customerQuotes: hasMany('customer-quote'),
});
