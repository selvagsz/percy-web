import Service from '@ember/service';
import {inject as service} from '@ember/service';

export default Service.extend({
  store: service(),

  createApprovalReview(build, snapshots) {
    const review = this.get('store').createRecord('review', {
      build,
      snapshots,
      action: 'approve',
    });
    return review.save().then(() => {
      build.reload().then(build => {
        build.get('snapshots').reload();
      });
    });
  },
});
