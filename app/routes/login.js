import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/router';
import localStorageProxy from 'percy-web/lib/localstorage';
import UnauthenticatedBaseRoute from 'percy-web/routes/unauthenticated-base';

export default UnauthenticatedBaseRoute.extend(EnsureStatefulLogin, {
  afterModel() {
    const redirectAddress = localStorageProxy.get(AUTH_REDIRECT_LOCALSTORAGE_KEY, '/', {
      useSessionStorage: true,
    });
    this.showLoginModalEnsuringState({onCloseDestinationRoute: redirectAddress});
  },
});
