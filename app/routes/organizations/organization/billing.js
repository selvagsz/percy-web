import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  stripe: service('stripev3'),

  beforeModel() {
    return this.get('stripe').load();
  },

  model() {
    let organization = this.modelFor('organizations.organization');
    return organization;
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);
      let organization = this.modelFor('organizations.organization');
      this.analytics.track('Billing Viewed', organization);
    },
  },
});
