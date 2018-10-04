import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import {getOwner} from '@ember/application';
import localStorageProxy from 'percy-web/lib/localstorage';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/router';

export default Component.extend(EnsureStatefulLogin, {
  session: service(),
  currentUser: readOnly('session.currentUser'),

  displayText: computed('currentUser', function() {
    if (this.get('currentUser')) {
      return 'You’re viewing a public Percy project. Only members of this organization can approve snapshots.';  // eslint-disable-line
    } else {
      return 'Welcome to Percy! Sign in to approve snapshots or create an account to start a free trial.'  // eslint-disable-line
    }
  }),

  btnText: computed('currentUser', function() {
    if (this.get('currentUser')) {
      return 'Jump to your projects';
    } else {
      return 'Sign in or start trial';
    }
  }),

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
