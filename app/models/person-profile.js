import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default Contentful.extend({
  contentType: 'person-profile',

  name: attr(),
  title: attr(),
  img: belongsTo('contentful-asset'), // model here: https://bit.ly/2MoN7fD
  iconLinks: hasMany('icon-link'),
  labels: attr(),
});
