import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
  disableInviteButton: computed('route', 'organization.currentUserIsAdmin', function() {
    const isAdmin = this.get('organization.currentUserIsAdmin');
    const onInvite = this.get('isInvitePath');
    return onInvite || !isAdmin;
  }),
});
