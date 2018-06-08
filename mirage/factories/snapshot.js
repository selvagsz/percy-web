import {Factory, trait} from 'ember-cli-mirage';
import {
  SNAPSHOT_APPROVED_STATE,
  SNAPSHOT_UNAPPROVED_STATE,
  SNAPSHOT_REVIEW_STATE_REASONS,
} from 'percy-web/models/snapshot';

const _unreviewedProps = {
  reviewState: SNAPSHOT_UNAPPROVED_STATE,
  reviewStateReason: SNAPSHOT_REVIEW_STATE_REASONS.UNREVIEWED,
};
const _userApprovedProps = {
  reviewState: SNAPSHOT_APPROVED_STATE,
  reviewStateReason: SNAPSHOT_REVIEW_STATE_REASONS.USER_APPROVED,
};
const _userApprovedPreviouslyProps = {
  reviewState: SNAPSHOT_APPROVED_STATE,
  reviewStateReason: SNAPSHOT_REVIEW_STATE_REASONS.USER_APPROVED_PREVIOUSLY,
};
const _noDiffProps = {
  reviewState: SNAPSHOT_APPROVED_STATE,
  reviewStateReason: SNAPSHOT_REVIEW_STATE_REASONS.NO_DIFFS,
};
const _autoApprovedBranchProps = {
  reviewState: SNAPSHOT_APPROVED_STATE,
  reviewStateReason: SNAPSHOT_REVIEW_STATE_REASONS.AUTO_APPROVED_BRANCH,
};

export default Factory.extend({
  id(i) {
    return `snapshot-${i}`;
  },
  name(i) {
    return `Exemplifying Test Snapshot That Shows Things ${i}`;
  },

  unreviewed: trait(_unreviewedProps),
  userApproved: trait(_userApprovedProps),
  userApprovedPreviously: trait(_userApprovedPreviouslyProps),

  withComparison: trait(
    Object.assign({}, _unreviewedProps, {
      afterCreate(snapshot, server) {
        const comparison = server.create('comparison');
        _addComparisonIds(comparison, snapshot);
      },
    }),
  ),

  noDiffs: trait(
    Object.assign({}, _noDiffProps, {
      afterCreate(snapshot, server) {
        const comparison = server.create('comparison', 'same');
        _addComparisonIds(comparison, snapshot);
      },
    }),
  ),

  withMobile: trait(
    Object.assign({}, _unreviewedProps, {
      afterCreate(snapshot, server) {
        const comparison = server.create('comparison', 'mobile');
        _addComparisonIds(comparison, snapshot);
      },
    }),
  ),
  withTwoBrowsers: trait(
    Object.assign({}, _unreviewedProps, {
      afterCreate(snapshot, server) {
        _addComparisonIds(server.create('comparison'), snapshot);
        _addComparisonIds(server.create('comparison', 'forChrome'), snapshot);
      },
    }),
  ),

  autoApprovedBranch: trait(
    Object.assign({}, _autoApprovedBranchProps, {
      afterCreate(snapshot, server) {
        const comparison = server.create('comparison');
        _addComparisonIds(comparison, snapshot);
      },
    }),
  ),
});

function _addComparisonIds(comparison, snapshot) {
  const comparisonIds = snapshot.comparisonIds;
  comparisonIds.push(comparison.id);
  snapshot.comparisonIds = comparisonIds;
  snapshot.save();
}
