import Controller from '@ember/controller';
import snapshotSort from 'percy-web/lib/snapshot-sort';
import {snapshotsWithDiffForBrowser} from 'percy-web/lib/filtered-comparisons';
import {task, timeout} from 'ember-concurrency';

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
  _initializeSnapshotOrdering: task(function*() {
    const orderedBrowserSnapshots = {};
    // Get snapshots without making new request
    const buildSnapshotsWithDiffs =
      this.get('build')
        .hasMany('snapshots')
        .value() || [];

    // If there are no snapshots with changes, this method will complete too fast for
    // the loading state to display properly. This gives a small delay so we can associate
    // all the data together and display the build page correctly.
    if (!buildSnapshotsWithDiffs.get('length')) {
      yield timeout(300);
    }

    const browsers = this.get('build.browsers');

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
  }).drop(),

  initializeSnapshotOrdering() {
    this.get('_initializeSnapshotOrdering').perform();
  },
});
