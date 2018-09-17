import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import metaTagLookup from 'percy-web/lib/meta-tags';
import {inject as service} from '@ember/service';

export default Route.extend(ResetScrollMixin, {
  headTags: metaTagLookup('root'),
  launchDarkly: service(),

  beforeModel() {
    if (this.get('launchDarkly').variation('updated-marketing-site')) {
      this.set('templateName', 'new-index');
    }
  },

  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'Home',
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Home Viewed');
    },
  },
});
