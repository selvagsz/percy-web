import Mixin from '@ember/object/mixin';

var MarketingRoute = Mixin.create({
  _getHero(pageType) {
    return this.store.queryRecord('hero-block', {
      'fields.page': pageType,
    });
  },

  _getContentBlocks(pageType) {
    return this.store
      .query('content-block', {
        'fields.page': pageType,
      })
      .then(contentBlocks => {
        return contentBlocks.sortBy('order');
      });
  },

  _getFooter(footerType) {
    return this.store.queryRecord('footer-cta', {
      'fields.type': footerType,
    });
  },
});

export default MarketingRoute;
