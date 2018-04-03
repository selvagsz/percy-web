import Service, {inject as service} from '@ember/service';
import {SNAPSHOT_REVIEW_STATE_REASONS, DIFF_REVIEW_STATE_REASONS} from 'percy-web/models/snapshot';

export default Service.extend({
  store: service(),
  getUnchangedSnapshots(build) {
    return this.get('store').query('snapshot', {
      filter: {
        build: build.get('id'),
        'review-state-reason': SNAPSHOT_REVIEW_STATE_REASONS.NO_DIFFS,
      },
    });
  },

  getChangedSnapshots(build) {
    return this.get('store').query('snapshot', {
      filter: {
        build: build.get('id'),
        'review-state-reason': DIFF_REVIEW_STATE_REASONS.join(','),
      },
    });
  },
});
