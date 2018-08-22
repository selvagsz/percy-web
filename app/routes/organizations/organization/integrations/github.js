import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  session: service(),

  beforeModel() {
    // If we don't force reload user on this page,
    // we don't get the associated Identities
    return this.get('session').forceReloadUser();
  },
});
