import Contentful from 'ember-data-contentful/models/contentful';
import DS from 'ember-data';

export default Contentful.extend({
  contentType: 'marketingPage',

  pageName: DS.attr(),
  blocks: DS.hasMany('block'),
});
