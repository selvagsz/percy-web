import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import {INTEGRATION_TYPES} from 'percy-web/lib/integration-types';

export default Route.extend(AuthenticatedRouteMixin, {
  setupController(controller, model) {
    this._super(controller, model);

    controller.setProperties({
      integrationItems: INTEGRATION_TYPES,
      availableIntegrations: model.get('availableIntegrations'),
    });
  },
  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      let organization = this.modelFor(this.routeName);
      if (organization) {
        this.analytics.track('Integrations Index Viewed', organization);
      }
      return true;
    },
  },
});
