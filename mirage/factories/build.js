import {Factory, trait} from 'ember-cli-mirage';
import moment from 'moment';
import {BUILD_STATES} from 'percy-web/models/build';

export default Factory.extend({
  branch: 'master',
  state: BUILD_STATES.FINISHED,
  reviewState: 'unreviewed',
  reviewStateReason: 'unreviewed_snapshots',
  totalSnapshots: 4,
  totalSnapshotsUnreviewed: 3,
  totalComparisonsDiff: 8,
  totalComparisonsFinished: 12,
  createdAt() {
    return moment();
  },
  buildNumber(i) {
    return i + 1;
  },

  afterCreate(build, server) {
    const browser = server.create('browser');
    build.update('browsers', [browser]);
  },

  approved: trait({
    state: BUILD_STATES.FINISHED,
    reviewState: 'approved',
    reviewStateReason: 'all_snapshots_approved',
  }),

  approvedPreviously: trait({
    state: BUILD_STATES.FINISHED,
    reviewState: 'approved',
    reviewStateReason: 'all_snapshots_approved_previously',
  }),

  approvedWithNoDiffs: trait({
    state: BUILD_STATES.FINISHED,
    reviewState: 'approved',
    reviewStateReason: 'no_diffs',
    totalComparisonsDiff: 0,
  }),

  pending: trait({
    state: BUILD_STATES.PENDING,
  }),

  expired: trait({
    state: BUILD_STATES.EXPIRED,
  }),

  failed: trait({
    state: BUILD_STATES.FAILED,
  }),

  failedWithTimeout: trait({
    state: BUILD_STATES.FAILED,
    failureReason: 'render_timeout',
  }),

  failedWithNoSnapshots: trait({
    state: BUILD_STATES.FAILED,
    failureReason: 'no_snapshots',
  }),

  failedWithMissingResources: trait({
    state: BUILD_STATES.FAILED,
    failureReason: 'missing_resources',
  }),

  processing: trait({
    state: BUILD_STATES.PROCESSING,
    totalComparisons: 2312,
    totalComparisonsFinished: 1543,
  }),

  withSnapshots: trait({
    afterCreate(build, server) {
      server.createList('snapshot', 3, 'withComparison', {build});
      server.create('snapshot', 'noDiffs', {build});
    },
  }),

  withTwoBrowsers: trait({
    afterCreate(build, server) {
      const ids = build.browserIds;
      ids.push(server.create('browser', 'chrome'));
      build.save();
    },
  }),
});
