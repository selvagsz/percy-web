import DS from 'ember-data';
import {equal} from '@ember/object/computed';
import {mapBy, max, or} from '@ember/object/computed';

export const SNAPSHOT_APPROVED_STATE = 'approved';
export const SNAPSHOT_UNAPPROVED_STATE = 'unreviewed';

export const SNAPSHOT_REVIEW_STATE_REASONS = {
  UNREVIEWED: 'unreviewed_comparisons',
  USER_APPROVED: 'user_approved',
  USER_APPROVED_PREVIOUSLY: 'user_approved_previously',
  NO_DIFFS: 'no_diffs',
};

// These are the possible reviewStateReasons for snapshots that have diffs
export const DIFF_REVIEW_STATE_REASONS = [
  SNAPSHOT_REVIEW_STATE_REASONS.UNREVIEWED,
  SNAPSHOT_REVIEW_STATE_REASONS.USER_APPROVED,
  SNAPSHOT_REVIEW_STATE_REASONS.USER_APPROVED_PREVIOUSLY,
];

export default DS.Model.extend({
  comparisons: DS.hasMany('comparisons', {
    async: false,
    inverse: 'headSnapshot',
  }),
  name: DS.attr(),
  build: DS.belongsTo('build', {async: true}),
  screenshots: DS.hasMany('screenshot', {async: false}),

  // Review state.
  reviewState: DS.attr(),
  isUnreviewed: equal('reviewState', SNAPSHOT_UNAPPROVED_STATE),
  isApproved: equal('reviewState', SNAPSHOT_APPROVED_STATE),

  // reviewStateReason provides disambiguation for how reviewState was set, such as when a
  // snapshot was approved automatically by the system when there are no diffs vs. when it is
  // approved by user review.
  //
  // reviewState --> reviewStateReason
  // - 'unreviewed' --> 'unreviewed_comparisons': No reviews have been submitted.
  // - 'approved' --> 'user_approved': approved by user review.
  // - 'approved' --> 'user_approved_previously': automatically approved because a user had recently
  //    approved the same thing in this branch.
  // - 'approved' --> 'no_diffs': automatically approved because there were no visual differences
  //    when compared the baseline.
  reviewStateReason: DS.attr(),
  isApprovedByUser: equal('reviewStateReason', SNAPSHOT_REVIEW_STATE_REASONS.USER_APPROVED),
  isApprovedByUserPreviously: equal(
    'reviewStateReason',
    SNAPSHOT_REVIEW_STATE_REASONS.USER_APPROVED_PREVIOUSLY,
  ),
  isUnchanged: equal('reviewStateReason', SNAPSHOT_REVIEW_STATE_REASONS.NO_DIFFS),

  // Is true for both approved in build and approved by carry-forward.
  isApprovedByUserEver: or('isApprovedByUser', 'isApprovedByUserPreviously'),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  comparisonWidths: mapBy('comparisons', 'width'),
  maxComparisonWidth: max('comparisonWidths'),
});
