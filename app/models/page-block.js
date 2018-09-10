import Contentful from 'ember-data-contentful/models/contentful';
import {bool} from '@ember/object/computed';
import {computed} from '@ember/object';

export default Contentful.extend({
  contentType: 'pageBlock',

  contentBlock: lookupContentfulModel('id', 'content-block'),
  isContentBlock: bool('contentBlock'),

  quoteGroup: lookupContentfulModel('id', 'customer-quote-group'),
  isQuoteGroup: bool('quoteGroup'),

  logoGroup: lookupContentfulModel('id', 'logo-group'),
  isLogoGroup: bool('logoGroup'),

  footerCta: lookupContentfulModel('id', 'footer-cta'),
  isFooter: bool('footerCta'),

  hero: lookupContentfulModel('id', 'hero-block'),
  isHero: bool('hero'),
});

function lookupContentfulModel(idKey, modelName) {
  return computed(idKey, function() {
    return this.get('store').peekRecord(modelName, this.get(idKey));
  });
}
