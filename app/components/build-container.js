import {or} from '@ember/object/computed';
import Component from '@ember/component';
import PollingMixin from 'percy-web/mixins/polling';
import {inject as service} from '@ember/service';

export default Component.extend(PollingMixin, {
  classNames: ['BuildContainer'],
  classNameBindings: ['isHidingBuildContainer:BuildContainer--snapshotModalOpen'],

  build: null,
  isHidingBuildContainer: false,
  snapshotQuery: service(),
  snapshotsChanged: null,
  numSnapshotsUnchanged: null,

  shouldPollForUpdates: or('build.isPending', 'build.isProcessing'),

  pollRefresh() {
    this.get('build')
      .reload()
      .then(build => {
        if (build.get('isFinished')) {
          const changedSnapshots = this.get('snapshotQuery').getChangedSnapshots(build);
          changedSnapshots.then(snapshots => {
            this.get('initializeSnapshotOrdering')(snapshots);
          });
        }
      });
  },

  actions: {
    showSnapshotFullModalTriggered(snapshotId, snapshotSelectedWidth) {
      this.sendAction('openSnapshotFullModal', snapshotId, snapshotSelectedWidth);
    },

    showSupport() {
      this.sendAction('showSupport');
    },
  },
});
