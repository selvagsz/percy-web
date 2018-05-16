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
import Service from '@ember/service';
import {resolve, defer} from 'rsvp';

describe('Integration: SnapshotList', function() {
  setupComponentTest('snapshot-list', {
    integration: true,
  });

  let snapshotQueryServiceStub;

  beforeEach(function() {
    setupFactoryGuy(this.container);
    SnapshotList.setContext(this);
  });

  function _mockSessionQueryFetches(context, snapshotsUnchanged, snapshotsChanged) {
    snapshotQueryServiceStub = Service.extend({
      getUnchangedSnapshots: sinon.stub().returns(resolve(snapshotsUnchanged)),
      getChangedSnapshots: sinon.stub().returns(resolve(snapshotsChanged)),
    });
    context.register('service:snapshotQuery', snapshotQueryServiceStub);
    context.inject.service('snapshotQuery', {as: 'snapshotQueryService'});
  }

  it('gets snapshots with no diffs after expanding no diffs section', function() {
    const stub = sinon.stub();
    const build = make('build', 'finished');
    const browser = make('browser');

    const numSnapshotsUnchanged = 3;
    const snapshotsUnchanged = makeList('snapshot', numSnapshotsUnchanged, 'withNoDiffs');
    const snapshotsChanged = [];
    _mockSessionQueryFetches(this, snapshotsUnchanged);

    this.setProperties({
      snapshotsChanged,
      numSnapshotsUnchanged,
      build,
      stub,
      browser,
    });

    this.render(hbs`{{snapshot-list
      build=build
      snapshotsChanged=snapshotsChanged
      numSnapshotsUnchanged=numSnapshotsUnchanged
      createReview=stub
      showSnapshotFullModalTriggered=stub
      activeBrowser=browser
    }}`);

    expect(SnapshotList.isNoDiffsBatchVisible).to.equal(true);

    SnapshotList.clickToggleNoDiffsSection();

    expect(SnapshotList.isNoDiffsBatchVisible).to.equal(false);
    expect(SnapshotList.snapshots().count).to.equal(numSnapshotsUnchanged);
  });

  it('shows loading indicator while fetching unchanged diffs', function() {
    const stub = sinon.stub();
    const build = make('build', 'finished');

    const numSnapshotsUnchanged = 3;
    const snapshotsChanged = [];
    _mockSessionQueryFetches(this, defer().promise);

    this.setProperties({
      snapshotsChanged,
      numSnapshotsUnchanged,
      build,
      stub,
    });

    this.render(hbs`{{snapshot-list
      build=build
      snapshotsChanged=snapshotsChanged
      numSnapshotsUnchanged=numSnapshotsUnchanged
      createReview=stub
      showSnapshotFullModalTriggered=stub
    }}`);

    SnapshotList.clickToggleNoDiffsSection();
    percySnapshot(this.test);
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
      }}`);
    });

    it('collapses all snapshots by default', function() {
      expect(SnapshotList.snapshots().count).to.equal(numSnapshots);
      SnapshotList.snapshots().forEach(snapshot => {
        expect(snapshot.isCollapsed).to.equal(true);
      });
      percySnapshot(this.test);
    });

    it('allows keyboard nav with up and down arrows', function() {
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
  });

  describe('keyboard nav behavior', function() {
    const numSnapshots = 3;
    beforeEach(function() {
      const stub = sinon.stub();
      const build = make('build', 'finished');
      const browser = make('browser');

      const numSnapshotsUnchanged = 3;
      const snapshotsChanged = makeList('snapshot', numSnapshots, 'withComparisons', {build});
      const snapshotsUnchanged = makeList('snapshot', numSnapshotsUnchanged, 'withNoDiffs', {
        build,
      });
      _mockSessionQueryFetches(this, snapshotsUnchanged);

      this.setProperties({
        build,
        snapshotsChanged,
        snapshotsUnchanged,
        numSnapshotsUnchanged,
        stub,
        browser,
        isKeyboardNavEnabled: true,
      });

      this.render(hbs`{{snapshot-list
        snapshotsChanged=snapshotsChanged
        numSnapshotsUnchanged=numSnapshotsUnchanged
        build=build
        createReview=stub
        showSnapshotFullModalTriggered=stub
        isKeyboardNavEnabled=isKeyboardNavEnabled
        activeBrowser=browser
      }}`);
    });

    it('automatically expands collapsed snapshots if focused', function() {
      // Open the collapsed no-diff snapshots
      SnapshotList.clickToggleNoDiffsSection();

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
