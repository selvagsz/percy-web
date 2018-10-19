import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Security Policy Viewed');
    },
  },
});
