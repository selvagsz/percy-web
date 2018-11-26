import Contentful from 'ember-data-contentful/models/contentful';
import {bool} from '@ember/object/computed';
import {computed} from '@ember/object';

export default Contentful.extend({
  contentType: 'pageBlock',

  contentBlock: lookupContentfulModel('id', 'content-block'),
  isContentBlock: bool('contentBlock'),

  quoteBlock: lookupContentfulModel('id', 'customer-quote-block'),
  isQuoteBlock: bool('quoteBlock'),

  logoBlock: lookupContentfulModel('id', 'customer-logo-block'),
  isLogoBlock: bool('logoBlock'),

  footerCta: lookupContentfulModel('id', 'footer-cta'),
  isFooter: bool('footerCta'),

  hero: lookupContentfulModel('id', 'hero-block'),
  isHero: bool('hero'),

  faqBlock: lookupContentfulModel('id', 'faq-block'),
  isFaqBlock: bool('faqBlock'),

  profileBlock: lookupContentfulModel('id', 'profile-block'),
  isProfileBlock: bool('profileBlock'),

  pricingCardBlock: lookupContentfulModel('id', 'pricing-card-block'),
  isPricingCardBlock: bool('pricingCardBlock'),

  pricingTableBlock: lookupContentfulModel('id', 'pricing-table'),
  isPricingTableBlock: bool('pricingTableBlock'),
});

function lookupContentfulModel(idKey, modelName) {
  return computed(idKey, function() {
    return this.get('store').peekRecord(modelName, this.get(idKey));
  });
}
