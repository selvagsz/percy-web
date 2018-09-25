import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';
import DS from 'ember-data';

export default Contentful.extend({
  contentType: 'srcSet',

  defaultImage: DS.belongsTo('contentful-asset'), // model here: https://bit.ly/2MoN7fD
  largeImageUrl: attr(),
});
