import Component from '@ember/component';
import {alias} from '@ember/object/computed';
import {computed} from '@ember/object';
// import DS from 'ember-data'; // TODO: Maybe remove if don't need for fromUser
import {inject as service} from '@ember/service'; // TODO: Maybe remove if don't need for fromUser

export default Component.extend({
  store: service(), // TODO: Maybe remove if don't need for fromUser

  defaultAvatar: computed(function() {
    return `${window.location.origin}/images/placeholder-avatar.jpg`;
  }),
  fromUser: computed('invite.fromUser', function() {
    return '[NOTE: this is broken when user removed from org]';
    // return this.get('invite.fromUser');
    // return this.get('store').find('user', this.get('invite.fromUser'));
    //
    // if (false) {
    //   // if (DS.Store.hasRecordForId('user', 'invite.fromUser')) {
    //   const user = this.get('invite.fromUser');
    //   return user.get('name');
    // } else {
    //   return 'deleted user';
    // }
  }),
  isAdmin: alias('organization.currentUserIsAdmin'),

  actions: {
    onCopyInviteUrlToClipboard() {
      this.get('flashMessages').success('Invite URL was copied to your clipboard');
    },
    cancelInvite() {
      const invite = this.get('invite');
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
        });
    },
  },
});
