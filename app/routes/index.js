import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import metaTagLookup from 'percy-web/lib/meta-tags';

export default Route.extend(ResetScrollMixin, {
  headTags: metaTagLookup('root'),
  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Home Viewed');
    },
  },
});
