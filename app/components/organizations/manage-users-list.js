import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  store: service(),
  orgInvites: readOnly('organization.invites'),
  invites: computed('orgInvites.@each.id', function() {
    const x = this.get('store')
      .peekAll('invite')
      .filterBy('organization.id', this.get('organization.id'))
      .filter(invite => {
        return !!invite.get('email');
      });
    // console.log(x);
    return x;
  }),
});
