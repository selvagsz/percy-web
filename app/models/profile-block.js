import Contentful from 'ember-data-contentful/models/contentful';
import {hasMany} from 'ember-data/relationships';

export default Contentful.extend({
  contentType: 'profileBlock',

  profiles: hasMany('person-profile'),
});
