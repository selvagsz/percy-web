import Contentful from 'ember-data-contentful/models/contentful';
import DS from 'ember-data';

export default Contentful.extend({
  contentType: 'faqBlock',

  title: DS.attr(),
  faqs: DS.hasMany('faq'),
});
