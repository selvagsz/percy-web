import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';

export default Contentful.extend({
  contentType: 'footerItem',

  category: attr(),
  order: attr(),
  text: attr(),
  textLink: attr(),
});
