import Component from '@ember/component';
import {inject as service} from '@ember/service';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';

export default Component.extend(EnsureStatefulLogin, {
  session: service(),

  isNavHidden: true,

  actions: {
    toggleIsNavHidden() {
      this.toggleProperty('isNavHidden');
    },
    clickLogin() {
      this.showLoginModalEnsuringState();
    },
    clickSignup() {
      this.showSignUpModal();
    },
  },
});
