import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';

export default Contentful.extend({
  contentType: 'heroBlock',

  page: attr(),
  superheader: attr(),
  header: attr(),
  subheadText: attr(),
});
