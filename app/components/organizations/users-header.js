import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
  disableInviteButton: computed('route', 'organization.currentUserIsAdmin', function() {
    const isAdmin = this.get('organization.currentUserIsAdmin');
    const onInvite = this.get('isInvitePath');
    return onInvite || !isAdmin;
  }),
  showInviteForm: computed('isInvitePath', 'organization.currentUserIsAdmin', function() {
    const isAdmin = this.get('organization.currentUserIsAdmin');
    const onInvite = this.get('isInvitePath');
    const canInvite = this.get('organization.canInvite');
    return onInvite && isAdmin && canInvite;
  }),
});
