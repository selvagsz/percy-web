import MarketingPageBaseRoute from 'percy-web/routes/marketing-page-base';

export default MarketingPageBaseRoute.extend({
  model() {
    return this.store.findAll('src-set').then(srcSets => {
      return srcSets.get('firstObject');
    });
  },

  setupController(controller, resolvedModel) {
    controller.set('srcSet', resolvedModel);
  },
});
