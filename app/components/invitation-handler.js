import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  invitation: null,

  classNames: ['InvitationHandler'],
  session: service(),
  currentUser: alias('session.currentUser'),

  flashMessages: service(),
  actions: {
    logout() {
      this.get('logout')();
    },
    accept() {
      // Invitations are accepted with a PATCH request against the invite endpoint.
      this.get('invitation')
        .save()
        .then(
          model => {
            this.get('inviteAccepted')(model);
          },
          () => {
            this.get('flashMessages').danger(
              'Something went wrong! You might already be in this organization. ' +
                'Feel free to reach out to hello@percy.io for help.',
            );
          },
        );
    },
  },
});
