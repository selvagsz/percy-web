import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {readOnly} from '@ember/object/computed';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import {getOwner} from '@ember/application';
import localStorageProxy from 'percy-web/lib/localstorage';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/router';

export default Component.extend(EnsureStatefulLogin, {
  session: service(),
  currentUser: readOnly('session.currentUser'),

  actions: {
    showLoginModal() {
      // Get the current URL and store it in session storage, so when the auth process is complete,
      // it can redirect the logged in user back to the same page.
      const currentURL = getOwner(this).lookup('controller:application').target.currentURL;
      localStorageProxy.set(AUTH_REDIRECT_LOCALSTORAGE_KEY, currentURL, {useSessionStorage: true});

      this.showLoginModalEnsuringState();
    },
  },
});
