import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';

export default Contentful.extend({
  contentType: 'faq',

  category: attr(),
  question: attr(),
  answer: attr(),
  page: attr(),
});
