import Component from '@ember/component';
import TargetApplicationActionsMixin from 'percy-web/mixins/target-application-actions';
import {inject as service} from '@ember/service';

export default Component.extend(TargetApplicationActionsMixin, {
  session: service(),
  actions: {
    clickLogin() {
      this.send('showLoginModal');
    },
    clickSignup() {
      this.send('showSignupModal');
    },
  },
});
