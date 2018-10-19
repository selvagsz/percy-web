import {or, alias, readOnly} from '@ember/object/computed';
import {assert} from '@ember/debug';
import Component from '@ember/component';
import PollingMixin from 'percy-web/mixins/polling';
import {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import {snapshotsWithNoDiffForBrowser} from 'percy-web/lib/filtered-comparisons';
import {task} from 'ember-concurrency';

export default Component.extend(PollingMixin, {
  classNames: ['BuildContainer'],
  classNameBindings: ['isHidingBuildContainer:BuildContainer--snapshotModalOpen'],

  store: service(),
  build: null,
  isHidingBuildContainer: false,
  snapshotQuery: service(),
  snapshotsUnchanged: null,
  allDiffsShown: true,
  updateActiveBrowser: null,
  isUnchangedSnapshotsVisible: false,
  isBuildApprovable: true,

  snapshotsChanged: computed('allChangedBrowserSnapshotsSorted', 'activeBrowser.id', function() {
    if (!this.get('allChangedBrowserSnapshotsSorted')) return;
    return this.get('allChangedBrowserSnapshotsSorted')[this.get('activeBrowser.id')];
  }),

  browserWithMostDiffs: computed('_browsers', 'allChangedBrowserSnapshotsSorted.[]', function() {
    const snapshots = this.get('allChangedBrowserSnapshotsSorted');
    if (!snapshots) {
      return;
    }

    const browserWithmostDiffsId = _browserWithMostDiffsId(snapshots);
    return this.get('_browsers').findBy('id', browserWithmostDiffsId);
  }),

  _browsers: alias('build.browsers'),

  defaultBrowser: computed('_browsers', 'browserWithMostDiffs', function() {
    const chromeBrowser = this.get('_browsers').findBy('familySlug', 'chrome');
    const browserWithMostDiffs = this.get('browserWithMostDiffs');
    if (browserWithMostDiffs) {
      return browserWithMostDiffs;
    } else if (chromeBrowser) {
      return chromeBrowser;
    } else {
      return this.get('_browsers.firstObject');
    }
  }),

  chosenBrowser: null,
  activeBrowser: or('chosenBrowser', 'defaultBrowser'),

  shouldPollForUpdates: or('build.isPending', 'build.isProcessing'),

  pollRefresh() {
    this.get('build')
      .reload()
      .then(build => {
        if (build.get('isFinished')) {
          this.set('isSnapshotsLoading', true);
          const changedSnapshots = this.get('snapshotQuery').getChangedSnapshots(build);
          changedSnapshots.then(() => {
            this.get('initializeSnapshotOrdering')();
          });
        }
      });
  },

  _getLoadedSnapshots() {
    // Get snapshots without making new request
    return this.get('store')
      .peekAll('snapshot')
      .filterBy('build.id', this.get('build.id'));
  },

  isUnchangedSnapshotsLoading: readOnly('_toggleUnchangedSnapshotsVisible.isRunning'),

  _toggleUnchangedSnapshotsVisible: task(function*() {
    let loadedSnapshots = this._getLoadedSnapshots();
    yield this.get('snapshotQuery').getUnchangedSnapshots(this.get('build'));
    loadedSnapshots = this._getLoadedSnapshots();

    const alreadyLoadedSnapshotsWithNoDiff = yield snapshotsWithNoDiffForBrowser(
      loadedSnapshots,
      this.get('activeBrowser'),
    ).sortBy('isUnchanged');

    this.set('snapshotsUnchanged', alreadyLoadedSnapshotsWithNoDiff);
    this.toggleProperty('isUnchangedSnapshotsVisible');
  }),

  _resetUnchangedSnapshots() {
    this.set('snapshotsUnchanged', null);
    this.set('isUnchangedSnapshotsVisible', false);
  },

  actions: {
    showSnapshotFullModalTriggered(snapshotId, snapshotSelectedWidth, activeBrowser) {
      this.sendAction('openSnapshotFullModal', snapshotId, snapshotSelectedWidth, activeBrowser);
    },

    updateActiveBrowser(newBrowser) {
      this.set('chosenBrowser', newBrowser);
      this._resetUnchangedSnapshots();
      const organization = this.get('build.project.organization');
      const eventProperties = {
        browser_id: newBrowser.get('id'),
        browser_family_slug: newBrowser.get('browserFamily.slug'),
        build_id: this.get('build.id'),
      };
      this.get('analytics').track('Browser Switched', organization, eventProperties);
    },

    toggleUnchangedSnapshotsVisible() {
      this.get('_toggleUnchangedSnapshotsVisible').perform();
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

function _browserWithMostDiffsId(allChangedBrowserSnapshotsSorted) {
  // need to convert the object of arrays to an array of objects
  // [{browserId: foo, len: int1}, {browserId: bar, len: int2}]
  const browserCounts = Object.keys(allChangedBrowserSnapshotsSorted).map(browserId => {
    return {
      browserId: browserId,
      len: allChangedBrowserSnapshotsSorted[browserId].length,
    };
  });

  let maxCount = 0;
  let maxCountId = null;

  // Use vanilla `for` loop so we can return early if we want.
  for (let i = 0; i < browserCounts.length; i++) {
    const browserCount = browserCounts[i];
    if (browserCount.len > maxCount) {
      maxCount = browserCount.len;
      maxCountId = browserCount.browserId;
    } else if (browserCount.len === maxCount) {
      return;
    }
  }

  return maxCountId;
}
