/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupRenderingTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import SnapshotViewerPO from 'percy-web/tests/pages/components/snapshot-viewer';
import {resolve} from 'rsvp';
import {SNAPSHOT_APPROVED_STATE, SNAPSHOT_UNAPPROVED_STATE} from 'percy-web/models/snapshot';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: SnapshotViewer', function() {
  setupRenderingTest('snapshot-viewer', {
    integration: true,
  });

  let snapshotTitle;
  let showSnapshotFullModalTriggeredStub;
  let snapshot;
  let createReviewStub;

  beforeEach(function() {
    setupFactoryGuy(this);
    SnapshotViewerPO.setContext(this);

    showSnapshotFullModalTriggeredStub = sinon.stub();
    createReviewStub = sinon.stub().returns(resolve());
    snapshotTitle = 'Awesome snapshot title';
    snapshot = make('snapshot', 'withComparisons', {name: snapshotTitle});
    const build = make('build', 'finished');
    const browser = make('browser');
    build.set('snapshots', [snapshot]);
    const stub = sinon.stub();

    this.setProperties({
      stub,
      snapshot,
      build,
      browser,
      userSelectedWidth: null,
      showSnapshotFullModalTriggered: showSnapshotFullModalTriggeredStub,
      createReview: createReviewStub,
      isBuildApprovable: true,
    });
  });

  it('displays snapshot name', async function() {
    await this.render(hbs`{{snapshot-viewer
      snapshot=snapshot
      build=build
      showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
      userSelectedWidth=userSelectedWidth
      createReview=createReview
      activeBrowser=browser
      isBuildApprovable=isBuildApprovable
    }}`);

    expect(SnapshotViewerPO.header.isTitleVisible, 'title should be visible').to.equal(true);

    expect(SnapshotViewerPO.header.titleText, 'title text should be correct').to.equal(
      snapshotTitle,
    );
  });

  it('compares visually to previous screenshot', async function() {
    await this.render(hbs`{{snapshot-viewer
      snapshot=snapshot
      build=build
      showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
      userSelectedWidth=userSelectedWidth
      activeBrowser=browser
      createReview=createReview
      isBuildApprovable=isBuildApprovable
    }}`);

    await percySnapshot(this.test);
  });

  describe('comparison mode switcher', function() {
    beforeEach(async function() {
      await this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        activeBrowser=browser
        createReview=createReview
        isBuildApprovable=isBuildApprovable
      }}`);
    });

    it('does not display', async function() {
      expect(
        SnapshotViewerPO.header.isComparisonModeSwitcherVisible,
        'comparison mode switcher should not be visible',
      ).to.equal(false);
    });
  });

  describe('width switcher', function() {
    beforeEach(async function() {
      // set the widest width comparison to have no diffs to have interesting test behavior.
      this.get('snapshot.comparisons')
        .findBy('width', 1024)
        .set('diffRatio', 0);
    });

    it('shows widest width with diff as active by default when some comparisons have diffs', async function() { // eslint-disable-line

      await this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        activeBrowser=browser
        createReview=createReview
        isBuildApprovable=isBuildApprovable
      }}`);

      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(true);
    });

    it('shows widest width with diff as active by default when no comparisons have diffs', async function() { // eslint-disable-line
      const snapshot = make('snapshot', 'withNoDiffs');
      this.set('snapshot', snapshot);

      await this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        activeBrowser=browser
        createReview=createReview
        isBuildApprovable=isBuildApprovable
      }}`);

      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(2).isActive).to.equal(true);
    });

    it('updates active button when clicked', async function() {
      await this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
        activeBrowser=browser
        updateActiveSnapshotId=stub
        isBuildApprovable=isBuildApprovable
      }}`);

      await SnapshotViewerPO.header.widthSwitcher.buttons(0).click();
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(true);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(false);

      await SnapshotViewerPO.header.clickDropdownToggle();
      await SnapshotViewerPO.header.clickToggleAllWidths();
      await SnapshotViewerPO.header.widthSwitcher.buttons(2).click();
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(2).isActive).to.equal(true);

      await SnapshotViewerPO.header.widthSwitcher.buttons(1).click();
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(1).isActive).to.equal(true);
      expect(SnapshotViewerPO.header.widthSwitcher.buttons(2).isActive).to.equal(false);
    });
  });

  describe('full screen toggle button', function() {
    beforeEach(async function() {
      await this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
        updateActiveSnapshotId=stub
        activeBrowser=browser
        isBuildApprovable=isBuildApprovable
      }}`);
    });

    it('displays', async function() {
      expect(SnapshotViewerPO.header.isFullScreenToggleVisible).to.equal(true);
    });

    it('sends closeSnapshotFullModal when toggle fullscreen button is clicked', async function() {
      const selectedWidth = snapshot.get('comparisons.firstObject.width');
      this.set('userSelectedWidth', selectedWidth);

      await SnapshotViewerPO.header.clickToggleFullscreen();
      expect(showSnapshotFullModalTriggeredStub).to.have.been.calledWith(
        this.get('snapshot.id'),
        selectedWidth,
      );
    });
  });

  describe('expand/collapse', function() {
    beforeEach(async function() {
      this.set('activeSnapshotId', null);

      await this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        userSelectedWidth=userSelectedWidth
        createReview=createReview
        activeSnapshotId=activeSnapshotId
        updateActiveSnapshotId=stub
        activeBrowser=browser
        isBuildApprovable=isBuildApprovable
      }}`);
    });

    it('is expanded by default when the snapshot is unapproved', async function() {
      this.set('snapshot.reviewState', SNAPSHOT_UNAPPROVED_STATE);
      expect(SnapshotViewerPO.isExpanded).to.equal(true);
    });

    it('is collapsed by default when the snapshot is approved', async function() {
      this.set('snapshot.reviewState', SNAPSHOT_APPROVED_STATE);
      expect(SnapshotViewerPO.isExpanded).to.equal(false);
    });

    it('is expanded when build is approved', async function() {
      this.set('snapshot.reviewState', SNAPSHOT_APPROVED_STATE);
      this.set('build.isApproved', true);

      expect(SnapshotViewerPO.isExpanded).to.equal(true);
    });

    it("is expanded when activeSnapshotId is equal to the snapshot's id", async function() {
      this.set('snapshot.reviewState', SNAPSHOT_APPROVED_STATE);
      this.set('activeSnapshotId', snapshot.get('id'));
      expect(SnapshotViewerPO.isExpanded).to.equal(true);
    });

    it('expands when the snapshot is collapsed and a user clicks the header ', async function() {
      this.set('snapshot.reviewState', SNAPSHOT_APPROVED_STATE);

      await SnapshotViewerPO.header.click();
      expect(SnapshotViewerPO.isExpanded).to.equal(true);
    });
  });

  describe('approve snapshot button', function() {
    beforeEach(async function() {
      setupFactoryGuy(this);
      SnapshotViewerPO.setContext(this);

      await this.render(hbs`{{snapshot-viewer
        snapshot=snapshot
        build=build
        showSnapshotFullModalTriggered=showSnapshotFullModalTriggered
        createReview=createReview
        updateActiveSnapshotId=stub
        activeBrowser=browser
        isBuildApprovable=isBuildApprovable
      }}`);
    });

    it('sends createReview with correct arguments when approve button is clicked', async function() { //eslint-disable-line
      await SnapshotViewerPO.header.clickApprove();
      expect(createReviewStub).to.have.been.calledWith([this.get('build.snapshots.firstObject')]);
    });

    it('does not display when build is not finished', async function() {
      this.set('build.state', 'pending');
      expect(SnapshotViewerPO.header.snapshotApprovalButton.isVisible).to.equal(false);
    });
  });
});
