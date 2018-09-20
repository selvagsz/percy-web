import Component from '@ember/component';
import {inject as service} from '@ember/service';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import {task, timeout} from 'ember-concurrency';

export default Component.extend(EnsureStatefulLogin, {
  session: service(),
  actions: {
    clickLogin() {
      this.showLoginModalEnsuringState();
    },
    clickSignup() {
      this.showSignUpModal();
    },

    open(dropdown) {
      if (this.closeLater.isRunning) {
        this.closeLater.cancelAll();
      } else {
        dropdown.actions.open();
      }
    },

    closeLater(dropdown) {
      this.closeLater.perform(dropdown);
    },

    prevent() {
      return false;
    },
  },

  // Wait 300ms after mouse leaves dropdown for it to close.
  closeLater: task(function*(dropdown) {
    yield timeout(300);
    dropdown.actions.close();
  }),
});
