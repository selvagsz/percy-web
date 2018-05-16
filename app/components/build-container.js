import {or} from '@ember/object/computed';
import {assert} from '@ember/debug';
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
  snapshotsUnchanged: null,
  allDiffsShown: true,

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
    showSnapshotFullModalTriggered(snapshotId, snapshotSelectedWidth, activeBrowser) {
      this.sendAction('openSnapshotFullModal', snapshotId, snapshotSelectedWidth, activeBrowser);
    },

    showSupport() {
      this.sendAction('showSupport');
    },

    toggleAllDiffs(options = {}) {
      this.toggleProperty('allDiffsShown');

      // Track the toggle event and source.
      const trackSource = options.trackSource;
      assert('invalid trackSource', ['clicked_toggle', 'keypress'].includes(trackSource));

      const build = this.get('build');
      const organization = build.get('project.organization');
      const eventProperties = {
        project_id: build.get('project.id'),
        project_slug: build.get('project.slug'),
        build_id: build.get('id'),
        state: this.get('allDiffsShown') ? 'on' : 'off',
        source: trackSource,
      };
      this.get('analytics').track('All Diffs Toggled', organization, eventProperties);
    },
  },
});
