/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupComponentTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import hbs from 'htmlbars-inline-precompile';
import {make, makeList} from 'ember-data-factory-guy';
import sinon from 'sinon';
import {percySnapshot} from 'ember-percy';
import SnapshotList from 'percy-web/tests/pages/components/snapshot-list';
import wait from 'ember-test-helpers/wait';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: SnapshotList', function() {
  setupComponentTest('snapshot-list', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    SnapshotList.setContext(this);
  });

  describe('when there are too many snapshots with diffs', function() {
    const numSnapshots = 10;

    beforeEach(function() {
      const stub = sinon.stub();
      const build = make('build', 'finished');
      const browser = make('browser');

      const snapshotsChanged = makeList('snapshot', numSnapshots, 'withComparisons', {build});
      this.set('snapshotsChanged', snapshotsChanged);

      this.setProperties({
        snapshotsChanged,
        build,
        stub,
        browser,
        isKeyboardNavEnabled: true,
      });

      // Override `isDefaultExpanded` so we don't have to render 150 snapshots at once
      this.render(hbs`{{snapshot-list
        snapshotsChanged=snapshotsChanged
        build=build
        createReview=stub
        showSnapshotFullModalTriggered=stub
        isKeyboardNavEnabled=isKeyboardNavEnabled
        activeBrowser=browser
        isDefaultExpanded=false
        toggleUnchangedSnapshotsVisible=stub
      }}`);
    });

    it('collapses all snapshots by default', function() {
      expect(SnapshotList.snapshots().count).to.equal(numSnapshots);
      SnapshotList.snapshots().forEach(snapshot => {
        expect(snapshot.isCollapsed).to.equal(true);
      });
      expect(SnapshotList.isTooManySnapshotsAlertVisible).to.equal(true);
      percySnapshot(this.test);
    });

    it('allows keyboard nav with up and down arrows', function() {
      expect(SnapshotList.isTooManySnapshotsAlertVisible).to.equal(true);

      SnapshotList.typeDownArrow();
      wait();
      expect(SnapshotList.snapshots(0).isExpanded).to.equal(true);
      expect(SnapshotList.snapshots(0).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(1).isExpanded).to.equal(false);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      percySnapshot(this.test);

      SnapshotList.typeDownArrow();
      wait();
      expect(SnapshotList.snapshots(0).isExpanded).to.equal(false);
      expect(SnapshotList.snapshots(0).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(1).isExpanded).to.equal(true);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(true);

      SnapshotList.typeUpArrow();
      wait();
      expect(SnapshotList.snapshots(0).isExpanded).to.equal(true);
      expect(SnapshotList.snapshots(0).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(1).isExpanded).to.equal(false);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
    });

    it('expands all snapshots if build is approved', function() {
      this.set('build.reviewState', 'approved');

      expect(SnapshotList.snapshots().count).to.equal(numSnapshots);
      SnapshotList.snapshots().forEach(snapshot => {
        expect(snapshot.isExpanded).to.equal(true);
      });
      expect(SnapshotList.isTooManySnapshotsAlertVisible).to.equal(false);
    });
  });

  describe('keyboard nav behavior', function() {
    const numSnapshots = 3;
    beforeEach(function() {
      const stub = sinon.stub();
      const build = make('build', 'finished');
      const browser = make('browser');

      const snapshotsChanged = makeList('snapshot', numSnapshots, 'withComparisons', {build});
      const snapshotsUnchanged = makeList('snapshot', 3, 'withNoDiffs', {build});

      this.setProperties({
        build,
        snapshotsChanged,
        snapshotsUnchanged,
        stub,
        browser,
        isKeyboardNavEnabled: true,
        isUnchangedSnapshotsVisible: false,
      });

      this.render(hbs`{{snapshot-list
        snapshotsChanged=snapshotsChanged
        build=build
        createReview=stub
        showSnapshotFullModalTriggered=stub
        isKeyboardNavEnabled=isKeyboardNavEnabled
        activeBrowser=browser
        toggleUnchangedSnapshotsVisible=stub
        isUnchangedSnapshotsVisible=isUnchangedSnapshotsVisible
        snapshotsUnchanged=snapshotsUnchanged
      }}`);
    });

    it('automatically expands collapsed snapshots if focused', function() {
      this.set('isUnchangedSnapshotsVisible', true);

      const firstNoDiffSnapshot = SnapshotList.snapshots(3);
      const secondNoDiffSnapshot = SnapshotList.snapshots(4);
      const thirdNoDiffSnapshot = SnapshotList.snapshots(5);

      // Manaully click the first snapshot.
      firstNoDiffSnapshot.expandSnapshot();
      wait();

      // We clicked on the first snapshot, so it's comparisons should be visible
      expect(firstNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(true);
      expect(secondNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(false);
      expect(thirdNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(false);
      // Arrow to second snapshot.
      SnapshotList.typeDownArrow();
      wait();

      // We clicked on the first snapshot, so it's comparisons should always visible.
      // We arrowed to second snapshot so it's comparisons should be visible.
      expect(firstNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(true);
      expect(secondNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(true);
      expect(thirdNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(false);

      // Arrow to third-to-last snapshot.
      SnapshotList.typeDownArrow();
      wait();

      // We clicked on the first snapshot, so it's comparisons should always visible.
      // We previously arrowed to the second snapshot, so it's comparisons should stay visible.
      // We arrowed to third snapshot so it's comparisons should be visible.
      expect(firstNoDiffSnapshot.isUnchangedComparisonsVisible, 'one').to.equal(true);
      expect(secondNoDiffSnapshot.isUnchangedComparisonsVisible, 'two').to.equal(false);
      expect(thirdNoDiffSnapshot.isUnchangedComparisonsVisible, 'three').to.equal(true);
    });

    it('focuses snapshots on arrow presses', function() {
      const numRenderedSnapshots = SnapshotList.snapshots().count;
      expect(numRenderedSnapshots).to.equal(numSnapshots);

      // select first snapshot
      SnapshotList.typeDownArrow();
      wait();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);

      // select second snapshot
      SnapshotList.typeDownArrow();
      wait();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);

      // select first snapshot
      SnapshotList.typeUpArrow();
      wait();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);

      // wrap around to select last snapshot
      SnapshotList.typeUpArrow();
      wait();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(true);
      percySnapshot(this.test);

      // wrap around to select first snapshot
      SnapshotList.typeDownArrow();
      wait();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);
    });

    it('does not send keyboard actions when isKeyboardNavEnabled is false', function() {
      const numRenderedSnapshots = SnapshotList.snapshots().count;
      this.set('isKeyboardNavEnabled', false);
      SnapshotList.typeDownArrow();
      wait();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);
    });
  });
});
