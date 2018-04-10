/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupComponentTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import SnapshotViewerPO from 'percy-web/tests/pages/components/snapshot-viewer';
import {resolve} from 'rsvp';
import {SNAPSHOT_APPROVED_STATE, SNAPSHOT_UNAPPROVED_STATE} from 'percy-web/models/snapshot';
import wait from 'ember-test-helpers/wait';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: SnapshotViewer', function() {
  setupComponentTest('snapshot-viewer', {
    integration: true,
  });

  let snapshotTitle;
  let showSnapshotFullModalTriggeredStub;
  let snapshot;
  let createReviewStub;

  beforeEach(function() {
    setupFactoryGuy(this.container);
    SnapshotViewerPO.setContext(this);

    showSnapshotFullModalTriggeredStub = sinon.stub();
    createReviewStub = sinon.stub().returns(resolve());
    snapshotTitle = 'Awesome snapshot title';
    snapshot = make('snapshot', 'withComparisons', {name: snapshotTitle});
    const build = make('build', 'finished');
    build.set('snapshots', [snapshot]);
    const stub = sinon.stub();

    this.setProperties({
      stub,
      snapshot,
      build,
      userSelectedWidth: null,
      showSnapshotFullModalTriggered: showSnapshotFullModalTriggeredStub,
      createReview: createReviewStub,
      // true is the default in the component
      isDefaultExpanded: true,
    });
  });

  it('displays snapshot name', function() {
    this.render(hbs`{{snapshot-viewer
      snapshot=snapshot
      build=build
      showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
      userSelectedWidth=userSelectedWidth
      createReview=createReview
    }}`);

    expect(SnapshotViewerPO.header.isTitleVisible, 'title should be visible').to.equal(true);

    expect(SnapshotViewerPO.header.titleText, 'title text should be correct').to.equal(
      snapshotTitle,
    );
  });

  it('compares visually to previous screenshot', function() {
    this.render(hbs`{{snapshot-viewer
      snapshot=snapshot
      build=build
      showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
      userSelectedWidth=userSelectedWidth
      createReview=createReview
    }}`);

    percySnapshot(this.test);
  });

  describe('comparison mode switcher', function() {
    beforeEach(function() {
      this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
      }}`);
    });

    it('does not display', function() {
      expect(
        SnapshotViewerPO.header.isComparisonModeSwitcherVisible,
        'comparison mode switcher should not be visible',
      ).to.equal(false);
    });
  });

  describe('width switcher', function() {
    beforeEach(function() {
      // set the widest width comparison to have no diffs to have interesting test behavior.
      this.get('snapshot.comparisons')
        .findBy('width', 1024)
        .set('diffRatio', 0);
    });

    it('shows widest width with diff as active by default when some comparisons have diffs', function() { // eslint-disable-line

      this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
      }}`);

      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(true);
    });

    it('shows widest width with diff as active by default when no comparisons have diffs', function() { // eslint-disable-line
      const snapshot = make('snapshot', 'withNoDiffs');
      this.set('snapshot', snapshot);

      this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
      }}`);

      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(2).isActive).to.equal(true);
    });

    it('updates active button when clicked', function() {
      this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
        updateActiveSnapshotId=stub
      }}`);

      SnapshotViewerPO.header.widthSwitcher.buttons(0).click();
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(true);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(false);

      SnapshotViewerPO.header.clickDropdownToggle();
      SnapshotViewerPO.header.clickToggleAllWidths();
      SnapshotViewerPO.header.widthSwitcher.buttons(2).click();
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(2).isActive).to.equal(true);

      SnapshotViewerPO.header.widthSwitcher.buttons(1).click();
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(true);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(2).isActive).to.equal(false);
    });
  });

  describe('full screen toggle button', function() {
    beforeEach(function() {
      this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
        updateActiveSnapshotId=stub
      }}`);
    });

    it('displays', function() {
      expect(SnapshotViewerPO.header.isFullScreenToggleVisible).to.equal(true);
    });

    it('sends closeSnapshotFullModal when toggle fullscreen button is clicked', function() {
      const selectedWidth = snapshot.get('comparisons.firstObject.width');
      this.set('userSelectedWidth', selectedWidth);

      SnapshotViewerPO.header.clickToggleFullscreen();
      expect(showSnapshotFullModalTriggeredStub).to.have.been.calledWith(
        this.get('snapshot.id'),
        selectedWidth,
      );
    });
  });

  describe('expand/collapse', function() {
    beforeEach(function() {
      this.set('activeSnapshotId', null);

      this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
        activeSnapshotId=activeSnapshotId
        updateActiveSnapshotId=stub
      }}`);
    });

    it('is expanded by default when the snapshot is unapproved', function() {
      this.set('snapshot.reviewState', SNAPSHOT_UNAPPROVED_STATE);
      expect(SnapshotViewerPO.isExpanded).to.equal(true);
    });

    it('is collapsed by default when the snapshot is approved', function() {
      this.set('snapshot.reviewState', SNAPSHOT_APPROVED_STATE);
      expect(SnapshotViewerPO.isExpanded).to.equal(false);
    });

    it('is collapsed when isDefaultExpanded is false', function() {
      this.set('snapshot.reviewState', SNAPSHOT_UNAPPROVED_STATE);
      this.set('isDefaultExpanded', false);

      return wait(() => {
        expect(SnapshotViewerPO.isExpanded).to.equal(false);
      });
    });

    it('is expanded when build is approved', function() {
      this.set('snapshot.reviewState', SNAPSHOT_APPROVED_STATE);
      this.set('build.isApproved', true);

      expect(SnapshotViewerPO.isExpanded).to.equal(true);
    });

    it("is expanded when activeSnapshotId is equal to the snapshot's id", function() {
      this.set('snapshot.reviewState', SNAPSHOT_APPROVED_STATE);
      this.set('activeSnapshotId', snapshot.get('id'));
      return wait(() => {
        expect(SnapshotViewerPO.isExpanded).to.equal(true);
      });
    });

    it('expands when the snapshot is collapsed and a user clicks the header ', function() {
      this.set('snapshot.reviewState', SNAPSHOT_APPROVED_STATE);

      SnapshotViewerPO.header.click();

      return wait(() => {
        expect(SnapshotViewerPO.isExpanded).to.equal(true);
      });
    });
  });

  describe('approve snapshot button', function() {
    beforeEach(function() {
      setupFactoryGuy(this.container);
      SnapshotViewerPO.setContext(this);

      this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        createReview=createReview
        updateActiveSnapshotId=stub
      }}`);
    });

    it('sends createReview with correct arguments when approve button is clicked', function() {
      SnapshotViewerPO.header.clickApprove();
      expect(createReviewStub).to.have.been.calledWith([this.get('build.snapshots.firstObject')]);
    });

    it('does not display when build is not finished', function() {
      this.set('build.state', 'pending');
      expect(SnapshotViewerPO.header.snapshotApprovalButton.isVisible).to.equal(false);
    });
  });
});
