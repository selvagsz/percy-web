import {create, collection, clickable, isVisible, triggerable} from 'ember-cli-page-object';
import {SnapshotViewer} from 'percy-web/tests/pages/components/snapshot-viewer';

const DOWN_ARROW_KEY = 40;
const UP_ARROW_KEY = 38;
const D_KEY = 68;

const SELECTORS = {
  SNAPSHOT_LIST: '[data-test-snapshot-list]',
  NO_DIFFS_TOGGLE: '[data-test-toggle-unchanged]',
};

export const SnapshotList = {
  scope: SELECTORS.SNAPSHOT_LIST,

  snapshots: collection({
    itemScope: SnapshotViewer.scope,
    item: SnapshotViewer,
  }),

  snapshotTitles: {
    isDescriptor: true,
    get() {
      return this.snapshots().map(snapshot => snapshot.name);
    },
  },

  lastSnapshot: {
    isDescriptor: true,
    get() {
      const numSnapshots = this.snapshots().count;
      return this.snapshots(numSnapshots - 1);
    },
  },

  indexOfSnapshot(snapshot) {
    return this.snapshots.indexOf(snapshot);
  },

  approvedSnapshots() {
    return this.snapshots()
      .toArray()
      .filterBy('isApproved', true);
  },

  unapprovedSnapshots() {
    return this.snapshots()
      .toArray()
      .filterBy('isUnapproved', true);
  },

  noDiffSnapshots() {
    return this.snapshots()
      .toArray()
      .filter(snapshot => {
        return snapshot.isApproved && snapshot.isUnchanged;
      });
  },

  isNoDiffsBatchVisible: isVisible(SELECTORS.NO_DIFFS_TOGGLE),
  clickToggleNoDiffsSection: clickable(SELECTORS.NO_DIFFS_TOGGLE),

  isDiffsVisibleForAllSnapshots: {
    isDescriptor: true,
    get() {
      return this.snapshots()
        .toArray()
        .every(snapshot => {
          return snapshot.isDiffImageVisible;
        });
    },
  },

  typeDownArrow: triggerable('keydown', '', {
    eventProperties: {keyCode: DOWN_ARROW_KEY},
  }),
  typeUpArrow: triggerable('keydown', '', {
    eventProperties: {keyCode: UP_ARROW_KEY},
  }),
  typeDiffToggleKey: triggerable('keydown', '', {
    eventProperties: {keyCode: D_KEY},
  }),
};

export default create(SnapshotList);
