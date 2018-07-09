import Mixin from '@ember/object/mixin';
import lockOptions from 'percy-web/lib/lock-settings';
import {inject as service} from '@ember/service';
import $ from 'jquery';
import {Promise, resolve} from 'rsvp';
import localStorageProxy from 'percy-web/lib/localstorage';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/router';

// This mixin should be used when accessing the lock.js authentication modal.
// This mixin fires a request to our backend's `/api/auth/session` endpoint and
// gets back an object with a state token (`{state: 'foo'}`).
// We wait for this token to get back, set it in the lock options, and
// only then have the lock modal show up.
// This should protect against CSRF attacks.
var EnsureStatefulLogin = Mixin.create({
  auth0: service(),
  session: service(),
  flashMessages: service(),

  _hasOpenedLoginModal: false,

  // Use this instead of calling `this.get('session').authenticate...` from your routes
  showLoginModalEnsuringState({onCloseDestinationRoute = null} = {}) {
    if (this.get('_hasOpenedLoginModal')) {
      return resolve();
    }
    return this._getStateToken().then(stateToken => {
      lockOptions.auth.params.state = stateToken.state;
      this._showLock(lockOptions, onCloseDestinationRoute);
    });
  },

  _getStateToken() {
    this.set('_hasOpenedLoginModal', true);
    return $.ajax({
      type: 'GET',
      url: '/api/auth/session',
    });
  },

  closeLock() {
    if (this.get('session.lockInstance')) {
      this.get('session.lockInstance').hide();
    }
  },

  _showLock(lockOptions, onCloseDestinationRoute) {
    _removeAuth0PasswordlessStyle();
    // This code is taken from
    // https://github.com/auth0-community/ember-simple-auth-auth0/
    //   blob/develop/addon/services/auth0.js#L93
    return new Promise((resolve, reject) => {
      // Despite the name of the method,
      // getAuth0LockInstance actually _creates_ an instance
      const lock = this.get('auth0').getAuth0LockInstance(lockOptions);

      this.get('auth0')._setupLock(lock, resolve, reject);
      this.set('session.lockInstance', lock);

      // all possible valid event hooks are listed here: http://bit.ly/2Btihk6
      lock.on('forgot_password submit', this._onPasswordResetSubmit.bind(this));
      lock.on('hide', this._onLockClosed.bind(this, onCloseDestinationRoute));

      lock.show();
    });
  },

  _onLockClosed(onCloseDestinationRoute) {
    this.set('_hasOpenedLoginModal', false);
    // If the modal is closed, remove the redirect key from localStorage.
    // The user has broken the flow.
    localStorageProxy.removeItem(AUTH_REDIRECT_LOCALSTORAGE_KEY, {useSessionStorage: true});
    // If a redirect was provided, AND there is a user, take the user to where they wanted to go.
    if (this.get('session.currentUser') && onCloseDestinationRoute) {
      this.transitionTo(onCloseDestinationRoute);
      // If we try to redirect to somewhere but there's no user,
      // the login route will show the modal infintiely. So if there was one provided but
      // the user exits out early, don't take them to the original route, take them to home.
    } else if (onCloseDestinationRoute) {
      this.transitionTo('/');
    }
  },

  _onPasswordResetSubmit() {
    this.get('flashMessages').success("We've sent an email to the address you've entered.");
  },

  showConnectToGithubPurchaseModal(githubPlanId) {
    const originalRedirectUrl = lockOptions.auth.redirectUrl;
    lockOptions.auth.redirectUrl = `${lockOptions.auth.redirectUrl}?github_plan_id=${githubPlanId}`;
    lockOptions.allowLogin = false;
    lockOptions.allowedConnections = ['github'];
    this.showLoginModalEnsuringState().then(() => {
      this.resetLockOptionsToDefault();
      lockOptions.auth.redirectUrl = originalRedirectUrl;
    });
  },

  showConnectToServiceModal(serviceName) {
    const originalRedirectUrl = lockOptions.auth.redirectUrl;
    lockOptions.auth.redirectUrl = `${lockOptions.auth.redirectUrl}?connect=true`;
    lockOptions.allowLogin = false;
    lockOptions.allowedConnections = [serviceName];
    this.showLoginModalEnsuringState().then(() => {
      this.resetLockOptionsToDefault();
      lockOptions.auth.redirectUrl = originalRedirectUrl;
    });
  },

  resetLockOptionsToDefault() {
    lockOptions.allowLogin = undefined;
    lockOptions.initialScreen = undefined;
    lockOptions.allowForgotPassword = undefined;
    lockOptions.allowSignup = undefined;
    lockOptions.allowedConnections = undefined;
  },
});

function _removeAuth0PasswordlessStyle() {
  $('style:contains("auth0-lock-cred-pane")')
    .not('#auth0-lock-style')
    .remove();
}

export default EnsureStatefulLogin;
