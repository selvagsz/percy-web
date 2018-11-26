import Contentful from 'ember-data-contentful/models/contentful';
import DS from 'ember-data';

export default Contentful.extend({
  contentType: 'pricingTableRow',

  rowTitle: DS.attr(),
  smallCell: DS.attr(),
  mediumCell: DS.attr(),
  largeCell: DS.attr(),
  classes: DS.attr(),
});
