import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';
import DS from 'ember-data';

export default Contentful.extend({
  contentType: 'contentBlock',

  page: attr(),
  order: attr(),
  mainImage: DS.belongsTo('contentful-asset'), // model here: https://bit.ly/2MoN7fD
  imagePosition: attr(),
  superheader: attr(),
  header: attr(),
  subheader: attr(),
  bodyText: attr(),
  bodyImages: attr(),
  supportingTextSections: DS.hasMany('supporting-content'),
  callToActionText: attr(),
  callToActionLink: attr(),
});
