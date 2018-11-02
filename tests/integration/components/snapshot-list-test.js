/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupRenderingTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import hbs from 'htmlbars-inline-precompile';
import {make, makeList} from 'ember-data-factory-guy';
import sinon from 'sinon';
import {percySnapshot} from 'ember-percy';
import SnapshotList from 'percy-web/tests/pages/components/snapshot-list';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: SnapshotList', function() {
  setupRenderingTest('snapshot-list', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    SnapshotList.setContext(this);
  });

  describe('when shouldDeferRendering is true', function() {
    const numSnapshots = 10;

    beforeEach(async function() {
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
        shouldDeferRendering: true,
      });

      await this.render(hbs`{{snapshot-list
        snapshotsChanged=snapshotsChanged
        build=build
        createReview=stub
        showSnapshotFullModalTriggered=stub
        activeBrowser=browser
        shouldDeferRendering=shouldDeferRendering
        toggleUnchangedSnapshotsVisible=stub
        isBuildApprovable=true
      }}`);
    });

    it('renders snapshot header placeholder', async function() {
      expect(SnapshotList.snapshots().count).to.equal(numSnapshots);
      SnapshotList.snapshots().forEach(snapshot => {
        expect(snapshot.isLazyRenderHeaderVisible).to.equal(true);
      });
      await percySnapshot(this.test);
    });
  });

  describe('keyboard nav behavior', function() {
    const numSnapshots = 3;
    beforeEach(async function() {
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

      await this.render(hbs`{{snapshot-list
        snapshotsChanged=snapshotsChanged
        build=build
        createReview=stub
        showSnapshotFullModalTriggered=stub
        isKeyboardNavEnabled=isKeyboardNavEnabled
        activeBrowser=browser
        toggleUnchangedSnapshotsVisible=stub
        isUnchangedSnapshotsVisible=isUnchangedSnapshotsVisible
        snapshotsUnchanged=snapshotsUnchanged
        isBuildApprovable=true
      }}`);
    });

    it('automatically expands collapsed snapshots if focused', async function() {
      this.set('isUnchangedSnapshotsVisible', true);

      const firstNoDiffSnapshot = SnapshotList.snapshots(3);
      const secondNoDiffSnapshot = SnapshotList.snapshots(4);
      const thirdNoDiffSnapshot = SnapshotList.snapshots(5);

      // Manaully click the first snapshot.
      await firstNoDiffSnapshot.expandSnapshot();

      // We clicked on the first snapshot, so it's comparisons should be visible
      expect(firstNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(true);
      expect(secondNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(false);
      expect(thirdNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(false);
      // Arrow to second snapshot.
      await SnapshotList.typeDownArrow();

      // We clicked on the first snapshot, so it's comparisons should always visible.
      // We arrowed to second snapshot so it's comparisons should be visible.
      expect(firstNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(true);
      expect(secondNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(true);
      expect(thirdNoDiffSnapshot.isUnchangedComparisonsVisible).to.equal(false);

      // Arrow to third-to-last snapshot.
      await SnapshotList.typeDownArrow();

      // We clicked on the first snapshot, so it's comparisons should always visible.
      // We previously arrowed to the second snapshot, so it's comparisons should stay visible.
      // We arrowed to third snapshot so it's comparisons should be visible.
      expect(firstNoDiffSnapshot.isUnchangedComparisonsVisible, 'one').to.equal(true);
      expect(secondNoDiffSnapshot.isUnchangedComparisonsVisible, 'two').to.equal(false);
      expect(thirdNoDiffSnapshot.isUnchangedComparisonsVisible, 'three').to.equal(true);
    });

    it('focuses snapshots on arrow presses', async function() {
      const numRenderedSnapshots = SnapshotList.snapshots().count;
      expect(numRenderedSnapshots).to.equal(numSnapshots);

      // select first snapshot
      await SnapshotList.typeDownArrow();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);

      // select second snapshot
      await SnapshotList.typeDownArrow();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);

      // select first snapshot
      await SnapshotList.typeUpArrow();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);

      // wrap around to select last snapshot
      await SnapshotList.typeUpArrow();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(true);
      await percySnapshot(this.test);

      // wrap around to select first snapshot
      await SnapshotList.typeDownArrow();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(true);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);
    });

    it('does not send keyboard actions when isKeyboardNavEnabled is false', async function() {
      const numRenderedSnapshots = SnapshotList.snapshots().count;
      this.set('isKeyboardNavEnabled', false);
      await SnapshotList.typeDownArrow();
      expect(SnapshotList.snapshots(0).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(1).isFocused).to.equal(false);
      expect(SnapshotList.snapshots(numRenderedSnapshots - 1).isFocused).to.equal(false);
    });
  });
});
