import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.modelFor('organizations.organization');
  },

  setupController(controller, resolvedModel) {
    controller.setProperties({
      organization: resolvedModel,
      isInvitePath: false,
    });
  },
});
