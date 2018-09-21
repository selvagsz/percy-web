import {inject as service} from '@ember/service';
import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';

// UnauthenticatedRouteMixin makes this route _inaccessible_
// when the user is logged in
export default Route.extend(UnauthenticatedRouteMixin, EnsureStatefulLogin, {
  session: service(),
  afterModel() {
    this.showSignUpModal({onCloseDestinationRoute: '/'});
  },
});
