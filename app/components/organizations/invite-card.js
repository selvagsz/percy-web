import Component from '@ember/component';
import {alias} from '@ember/object/computed';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  defaultAvatar: computed(function() {
    return `${window.location.origin}/images/placeholder-avatar.jpg`;
  }),
  isAdmin: alias('organization.currentUserIsAdmin'),
  store: service(),
  actions: {
    onCopyInviteUrlToClipboard() {
      this.get('flashMessages').success('Invite URL was copied to your clipboard');
    },
    cancelInvite() {
      const invite = this.get('invite');
      const orgId = this.get('organization').get('id');
      let confirmation = confirm(
        `Are you sure you want to cancel the invitation to ${invite.email}?`,
      );
      if (!confirmation) {
        return;
      }
      invite
        .destroyRecord()
        .then(() => {
          this.get('flashMessages').success(`The invitation to ${invite.email} has been cancelled`);
        })
        .catch(() => {
          this.get('flashMessages').danger(
            `There was a problem cancelling the invitation to ${invite.email}.` +
              ' Please try again or contact customer support.',
          );
        })
        .finally(() => {
          this.get('store').findRecord('organization', orgId, {reload: true});
        });
    },
  },
});
