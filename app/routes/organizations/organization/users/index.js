import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {hash} from 'rsvp';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  intercom: service(),

  model() {
    const organization = this.modelFor('organizations.organization');
    return hash({
      organization,
      users: this.store.query('organization-user', {organization}),
    });
  },

  setupController(controller, resolvedModel) {
    controller.setProperties({
      users: resolvedModel.users,
      organization: resolvedModel.organization,
    });
  },

  actions: {
    showSupport() {
      this.get('intercom').showIntercom();
    },
  },
});
