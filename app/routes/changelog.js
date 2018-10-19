import Route from '@ember/routing/route';
import metaTagLookup from 'percy-web/lib/meta-tags';

export default Route.extend({
  headTags: metaTagLookup('changelog'),
  model() {
    return this.store.findAll('changelog-post').then(posts => {
      return posts.sortBy('date').reverse();
    });
  },

  actions: {
    didTransition() {
      this._super(...arguments);
      this.analytics.track('Changelog Page Viewed', null, {path: '/changelog'});
    },
  },
});
