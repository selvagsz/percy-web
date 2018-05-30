import Controller from '@ember/controller';
import snapshotSort from 'percy-web/lib/snapshot-sort';
import {snapshotsWithDiffForBrowser} from 'percy-web/lib/filtered-comparisons';

// NOTE: before adding something here, consider adding it to BuildContainer instead.
// This controller should only be used to maintain the state of which snapshots have been loaded.
export default Controller.extend({
  isHidingBuildContainer: false,

  allChangedBrowserSnapshotsSorted: null, // Manually managed by initializeSnapshotOrdering.

  // This breaks the binding for allChangedBrowserSnapshotsSorted,
  // specifically so that when a user clicks
  // approve, the snapshot stays in place until reload.
  //
  // Called by the route when entered and snapshots load.
  // Called by polling when snapshots reload after build is finished.
  // Creates a hash with a keys of each browser id,
  // and the correctly ordered snapshots as the values and sets it as
  // allChangedBrowserSnapshotsSorted.
  initializeSnapshotOrdering() {
    const orderedBrowserSnapshots = {};
    // Get snapshots without making new request
    const buildSnapshotsWithDiffs =
      this.get('build')
        .hasMany('snapshots')
        .value() || [];

    const browsers = this.get('build.browsers');

    if (!browsers.length && window.Raven) {
      // There should always be browsers loaded, but there appears to be a certain race condition
      // when navigating from projects to builds where build relationships are not fully loaded.
      // Capture information about how often a race condition is happening. TODO: drop this.
      let error = new Error('Missing browsers in initializeSnapshotOrdering');
      window.Raven.captureException(error);
    }

    browsers.forEach(browser => {
      const snapshotsWithDiffs = snapshotsWithDiffForBrowser(buildSnapshotsWithDiffs, browser);
      const sortedSnapshotsWithDiffs = snapshotSort(snapshotsWithDiffs.toArray(), browser);
      const approvedSnapshots = sortedSnapshotsWithDiffs.filterBy('isApprovedByUserEver');
      const unreviewedSnapshots = sortedSnapshotsWithDiffs.filterBy('isUnreviewed');
      orderedBrowserSnapshots[browser.get('id')] = [].concat(
        unreviewedSnapshots,
        approvedSnapshots,
      );
    });

    this.setProperties({
      allChangedBrowserSnapshotsSorted: orderedBrowserSnapshots,
      isSnapshotsLoading: false,
    });
  },
});
