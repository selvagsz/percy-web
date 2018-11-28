import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  intercom: service(),

  disableInviteButton: computed('route', 'organization.currentUserIsAdmin', function() {
    const isAdmin = this.get('organization.currentUserIsAdmin');
    const onInvite = this.get('isInvitePath');
    const noInvites = !this.get('organization.seatsRemaining');
    if (noInvites) {
      return true;
    } else {
      return onInvite || !isAdmin;
    }
  }),
  showInviteForm: computed('isInvitePath', 'organization.currentUserIsAdmin', function() {
    const isAdmin = this.get('organization.currentUserIsAdmin');
    const onInvite = this.get('isInvitePath');
    const canInvite = this.get('organization.canInvite');
    return onInvite && isAdmin && canInvite;
  }),

  actions: {
    showSupport() {
      this.get('intercom').showIntercom();
    },
  },
});
