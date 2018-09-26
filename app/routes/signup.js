import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import UnauthenticatedBaseRoute from 'percy-web/routes/unauthenticated-base';

export default UnauthenticatedBaseRoute.extend(EnsureStatefulLogin, {
  afterModel() {
    this.showSignUpModal({onCloseDestinationRoute: '/'});
  },
});
