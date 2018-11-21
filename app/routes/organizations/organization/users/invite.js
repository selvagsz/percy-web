import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  intercom: service(),

  model() {
    return this.modelFor('organizations.organization');
  },

  setupController(controller, resolvedModel) {
    controller.setProperties({
      organization: resolvedModel,
    });
  },
});
