import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import {inject as service} from '@ember/service';

export default Route.extend(ResetScrollMixin, {
  launchDarkly: service(),

  beforeModel() {
    if (!this.get('launchDarkly').variation('updated-marketing-site')) {
      this.transitionTo('/');
    }
  },

  model() {
    return this.get('store').queryRecord('marketing-page', {
      'fields.pageName': 'VisualTesting',
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);
      this.analytics.track('Visual Testing Viewed');
    },
  },
});
