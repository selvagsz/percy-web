import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import {variation} from 'ember-launch-darkly';
import {hash} from 'rsvp';
import MarketingRouteMixin from 'percy-web/mixins/marketing-route';

export default Route.extend(ResetScrollMixin, MarketingRouteMixin, {
  beforeModel() {
    if (!variation('updated-marketing-site')) {
      this.transitionTo('/');
    }
  },

  pageType: 'Features',
  footerType: 'Generic',

  model() {
    return hash({
      hero: this._getHero(this.get('pageType')),
      contentBlocks: this._getContentBlocks(this.get('pageType')),
      footer: this._getFooter(this.get('footerType')),
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      // TODO: Add organization tracking
      this.analytics.track('Features Viewed');
    },
  },
});
