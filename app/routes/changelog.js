import Route from '@ember/routing/route';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';

export default Route.extend(ResetScrollMixin, {
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
