import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';
import {belongsTo} from 'ember-data/relationships';

export default Contentful.extend({
  contentType: 'customerLogo',

  customerName: attr(),
  logo: attr(),
  type: attr(),
  image: belongsTo('contentful-asset'), // model here: https://bit.ly/2MoN7fD
});
