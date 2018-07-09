import {inject as service} from '@ember/service';
import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/router';
import localStorageProxy from 'percy-web/lib/localstorage';

// UnauthenticatedRouteMixin makes this route _inaccessible_
// when the user is logged in
export default Route.extend(UnauthenticatedRouteMixin, EnsureStatefulLogin, {
  session: service(),
  afterModel() {
    const redirectAddress = localStorageProxy.get(AUTH_REDIRECT_LOCALSTORAGE_KEY, '/', {
      useSessionStorage: true,
    });
    this.showLoginModalEnsuringState({onCloseDestinationRoute: redirectAddress});
  },
});
