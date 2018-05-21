import {computed} from '@ember/object';
import {bool, and, equal, not, or, filterBy, gt} from '@ember/object/computed';
import DS from 'ember-data';
import moment from 'moment';
import {countDiffsWithSnapshotsPerBrowser} from 'percy-web/lib/filtered-comparisons';

export const BUILD_STATES = {
  FINISHED: 'finished',
  PENDING: 'pending',
  PROCESSING: 'processing',
  FAILED: 'failed',
  EXPIRED: 'expired',
};

const PENDING_LABEL = 'Receiving';
const PROCESSING_LABEL = 'Processing';
const UNREVIEWED_LABEL = 'Unreviewed';
const APPROVED_LABEL = 'Approved';
const NO_DIFFS_LABEL = 'No Changes';
const FAILED_LABEL = 'Failed';
const EXPIRED_LABEL = 'Expired';

export default DS.Model.extend({
  project: DS.belongsTo('project', {async: false}),
  repo: DS.belongsTo('repo', {async: false}),

  // Check isGithubLinked before accessing repo.
  isGithubLinked: bool('repo'),

  isGithubPullRequest: and('isGithubLinked', 'isPullRequest'),

  buildNumber: DS.attr('number'),
  buildTitle: computed('buildNumber', function() {
    return `Build #${this.get('buildNumber')}`;
  }),
  branch: DS.attr(),
  browsers: DS.hasMany('browser', {async: false}),
  hasMultipleBrowsers: gt('browsers.length', 1),

  // Processing state.
  state: DS.attr(),
  isPending: equal('state', BUILD_STATES.PENDING),
  isProcessing: equal('state', BUILD_STATES.PROCESSING),
  isFinished: equal('state', BUILD_STATES.FINISHED),
  isFailed: equal('state', BUILD_STATES.FAILED),
  isExpired: equal('state', BUILD_STATES.EXPIRED),
  failureReason: DS.attr(),
  failureReasonHumanized: computed('failureReason', function() {
    let failureReason = this.get('failureReason');
    if (failureReason === 'missing_resources') {
      return 'Missing resources';
    } else if (failureReason === 'no_snapshots') {
      return 'No snapshots';
    } else if (failureReason === 'render_timeout') {
      return 'Timed out';
    }
  }),

  // failureDetails will be a POJO of form `{something: [strings, strings, etc]}` and therefore
  // will not be able to trigger computed property recomputes
  failureDetails: DS.attr(),

  isRunning: or('isPending', 'isProcessing'),

  // Review state, aggregated across all reviews. This will only be set for finished builds.
  reviewState: DS.attr(),
  isUnreviewed: equal('reviewState', 'unreviewed'),
  isApproved: equal('reviewState', 'approved'),

  // reviewStateReason provides disambiguation for how reviewState was set, such as when a
  // build was approved automatically by the system when there are no diffs vs. when it is
  // approved by user review.
  //
  // reviewState --> reviewStateReason
  // - 'unreviewed' --> 'unreviewed_snapshots': Not all snapshots have been reviewed.
  // - 'approved' --> 'all_snapshots_approved': All snapshots were approved by user review.
  // - 'approved' --> 'all_snapshots_approved_previously': All snapshots were automatically approved
  //   because a user had previously approved the same snapshots in this branch.
  // - 'approved' --> 'no_diffs': All snapshots were automatically approved because there were no
  //    visual differences when compared with the baseline.
  reviewStateReason: DS.attr(),

  // Aggregate numbers for snapshots and comparisons. These will only be set for finished builds.
  // Each snapshot is a top-level UI state that may encompass multiple comparisons.
  // Each comparison represents a single individual rendering at a width and browser.
  totalSnapshots: DS.attr('number'),
  totalSnapshotsUnreviewed: DS.attr('number'),

  totalComparisons: DS.attr('number'),
  totalComparisonsFinished: DS.attr('number'),
  totalComparisonsDiff: DS.attr('number'),
  buildCompletionPercent: computed(
    'totalComparisons',
    'totalComparisonsFinished',
    'isProcessing',
    function() {
      const totalComparisons = this.get('totalComparisons') || 0;

      // Make sure that if totalComparisons returns 0 that we're not dividing against it
      if (!this.get('isProcessing') || totalComparisons === 0) {
        return 0;
      }

      const totalComparisonsFinished = this.get('totalComparisonsFinished') || 0;
      return totalComparisonsFinished / totalComparisons * 100;
    },
  ),
  hasDiffs: computed('totalComparisonsDiff', 'isFinished', function() {
    // Only have the chance to return true if the build is finished.
    if (!this.get('isFinished')) {
      return false;
    }

    return this.get('totalComparisonsDiff') > 0;
  }),

  buildStatusLabel: computed('state', 'reviewState', function() {
    if (this.get('isPending')) {
      return PENDING_LABEL;
    } else if (this.get('isProcessing')) {
      return PROCESSING_LABEL;
    } else if (this.get('isFinished')) {
      if (this.get('isApproved')) {
        if (this.get('reviewStateReason') === 'no_diffs') {
          return NO_DIFFS_LABEL;
        } else {
          return APPROVED_LABEL;
        }
      } else if (this.get('isUnreviewed')) {
        return UNREVIEWED_LABEL;
      }
    } else if (this.get('isFailed')) {
      return FAILED_LABEL;
    } else if (this.get('isExpired')) {
      return EXPIRED_LABEL;
    }
  }),

  commit: DS.belongsTo('commit', {async: false}), // Might be null.
  baseBuild: DS.belongsTo('build', {async: false, inverse: null}),
  snapshots: DS.hasMany('snapshot', {async: true}),

  unreviewedSnapshots: filterBy('snapshots', 'isUnreviewed'),
  unreviewedSnapshotsWithDiffs: filterBy('unreviewedSnapshots', 'isUnchanged', false),

  comparisons: computed('snapshots', function() {
    return this.get('snapshots').reduce((acc, snapshot) => {
      return acc.concat(snapshot.get('comparisons').toArray());
    }, []);
  }),

  hasNoDiffs: not('hasDiffs'),
  isPullRequest: DS.attr('boolean'),
  pullRequestNumber: DS.attr('number'),
  pullRequestTitle: DS.attr(),

  finishedAt: DS.attr('date'),
  approvedAt: DS.attr('date'),
  approvedBy: DS.belongsTo('user', {async: false}),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  userAgent: DS.attr(),

  duration: computed('finishedAt', 'createdAt', function() {
    var finished = this.get('finishedAt');
    if (!finished) {
      finished = moment();
    }
    var started = this.get('createdAt');
    var milliseconds = moment(finished).diff(started);
    return moment.duration(milliseconds);
  }),

  // Convenience methods for accessing common methods in templates.
  durationHours: computed('duration', function() {
    return this.get('duration').hours();
  }),
  durationMinutes: computed('duration', function() {
    return this.get('duration').minutes();
  }),
  durationSeconds: computed('duration', function() {
    return this.get('duration').seconds();
  }),

  reloadAll() {
    return this.store.findRecord('build', this.get('id'), {reload: true});
  },

  // Returns Ember Object with a property for each browser for the build,
  // where the value is an array of snapshots that have diffs for that browser.
  // It is an ember object rather than a POJO so computed properties can observe it, and for ease
  // of use in templates.
  unapprovedSnapshotsWithDiffForBrowsers: computed(
    'unreviewedSnapshotsWithDiffs.[]',
    'browsers.[]',
    function() {
      const unreviewedSnapshotsWithDiffs = this.get('unreviewedSnapshotsWithDiffs');
      return countDiffsWithSnapshotsPerBrowser(unreviewedSnapshotsWithDiffs, this.get('browsers'));
    },
  ),
});
