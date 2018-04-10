import {alias} from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  isApproved: alias('snapshot.isApproved'),
  isLoading: false,
  tagName: '',

  actions: {
    approveSnapshot() {
      this.set('isLoading', true);
      this.get('createReview')([this.get('snapshot')])
        .then(() => {
          // The time between when we get the response back from the server and the time
          // it takes Ember to process and render the returned data is actually quite long (~1s)
          // on production. So setting these properties here disguises that transition time and
          // prevents jank in the Approve/Approved button state
          this.set('snapshot.reviewState', 'approved');
          this.set('snapshot.reviewStateReason', 'user_approved');
        })
        .finally(() => {
          this.set('isLoading', false);
        });
    },
  },
});
