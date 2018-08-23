/* jshint expr:true */
import {setupComponentTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import {resolve} from 'rsvp';
import FullSnapshotPage from 'percy-web/tests/pages/components/snapshot-viewer-full';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: SnapshotViewerFull', function() {
  setupComponentTest('snapshot-viewer-full', {
    integration: true,
  });

  let closeSnapshotFullModalStub;
  let updateComparisonModeStub;
  let createReviewStub;
  let addedSnapshot;
  let snapshot;
  let build;
  const snapshotTitle = 'Awesome snapshot title';

  beforeEach(function() {
    setupFactoryGuy(this.container);
    FullSnapshotPage.setContext(this);

    build = make('build', 'finished');
    const browser = make('browser');
    snapshot = make('snapshot', 'withComparisons', {
      build,
      name: snapshotTitle,
    });

    addedSnapshot = make('snapshot', 'new', {build});

    closeSnapshotFullModalStub = sinon.stub();
    updateComparisonModeStub = sinon.stub();
    createReviewStub = sinon.stub().returns(resolve());

    const snapshotSelectedWidth = snapshot
      .get('comparisons')
      .sortBy('width')
      .objectAt(1)
      .get('width');

    this.setProperties({
      snapshotSelectedWidth,
      browser,
      snapshot: snapshot,
      comparisonMode: 'diff',
      closeSnapshotFullModal: closeSnapshotFullModalStub,
      updateComparisonMode: updateComparisonModeStub,
      createReview: createReviewStub,
      isBuildApprovable: true,
      stub: sinon.stub(),
    });

    this.render(hbs`{{snapshot-viewer-full
      snapshot=snapshot
      snapshotSelectedWidth=snapshotSelectedWidth
      comparisonMode=comparisonMode
      transitionRouteToWidth=stub
      updateComparisonMode=updateComparisonMode
      closeSnapshotFullModal=closeSnapshotFullModal
      createReview=createReview
      activeBrowser=browser
      isBuildApprovable=isBuildApprovable
    }}`);
  });

  it('displays snapshot name', function() {
    expect(FullSnapshotPage.header.isTitleVisible, 'title should be visible').to.equal(true);

    expect(FullSnapshotPage.header.titleText, 'title text should be correct').to.equal(
      snapshotTitle,
    );
  });

  describe('comparison mode switcher', function() {
    it('displays comparison mode switcher', function() {
      expect(
        FullSnapshotPage.header.isComparisonModeSwitcherVisible,
        'comparison mode switcher should be visible',
      ).to.equal(true);
    });

    it('sends updateComparisonMode action when comparison switcher is clicked', function() {
      FullSnapshotPage.header.clickBaseComparisonMode();
      expect(updateComparisonModeStub).to.have.been.calledWith('base');

      FullSnapshotPage.header.clickDiffComparisonMode();
      expect(updateComparisonModeStub).to.have.been.calledWith('diff');

      FullSnapshotPage.header.clickHeadComparisonMode();
      expect(updateComparisonModeStub).to.have.been.calledWith('head');
    });

    it('shows "New" button when snapshot is new', function() {
      this.set('snapshot', addedSnapshot);

      expect(FullSnapshotPage.isNewComparisonModeButtonVisible).to.equal(true);
      percySnapshot(this.test);
    });
  });

  describe('width switcher', function() {
    it('displays', function() {
      expect(
        FullSnapshotPage.header.isWidthSwitcherVisible,
        'width switcher should be visible',
      ).to.equal(true);
    });

    it('displays correct number as selected', function() {
      expect(FullSnapshotPage.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(FullSnapshotPage.header.widthSwitcher.buttons(1).isActive).to.equal(true);
      expect(FullSnapshotPage.header.widthSwitcher.buttons(2).isActive).to.equal(false);
    });

    it('updates active button when clicked', function() {
      FullSnapshotPage.header.widthSwitcher.buttons(0).click();
      expect(FullSnapshotPage.header.widthSwitcher.buttons(0).isActive).to.equal(true);
      expect(FullSnapshotPage.header.widthSwitcher.buttons(1).isActive).to.equal(false);
      expect(FullSnapshotPage.header.widthSwitcher.buttons(2).isActive).to.equal(false);
      FullSnapshotPage.header.widthSwitcher.buttons(2).click();
      expect(FullSnapshotPage.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(FullSnapshotPage.header.widthSwitcher.buttons(1).isActive).to.equal(false);
      expect(FullSnapshotPage.header.widthSwitcher.buttons(2).isActive).to.equal(true);

      FullSnapshotPage.header.widthSwitcher.buttons(1).click();
      expect(FullSnapshotPage.header.widthSwitcher.buttons(0).isActive).to.equal(false);
      expect(FullSnapshotPage.header.widthSwitcher.buttons(1).isActive).to.equal(true);
      expect(FullSnapshotPage.header.widthSwitcher.buttons(2).isActive).to.equal(false);
    });
  });

  it('compares visually to previous screenshot', function() {
    percySnapshot(this.test);
  });

  describe('full screen toggle button', function() {
    it('displays', function() {
      expect(FullSnapshotPage.header.isFullScreenToggleVisible).to.equal(true);
    });

    it('sends closeSnapshotFullModal when toggle fullscreen button is clicked', function() {
      FullSnapshotPage.header.clickToggleFullscreen();
      expect(closeSnapshotFullModalStub).to.have.been.called;
    });
  });

  describe('approve snapshot button', function() {
    it('sends createReview with correct arguments when approve button is clicked', function() {
      FullSnapshotPage.header.clickApprove();
      expect(createReviewStub).to.have.been.calledWith([snapshot]);
    });

    it('does not display when build is not finished', function() {
      this.set('snapshot.build.isFinished', false);
      expect(FullSnapshotPage.header.snapshotApprovalButton.isVisible).to.equal(false);
    });

    it('is disabled when isBuildApprovable is false', function() {
      this.set('isBuildApprovable', false);
      expect(FullSnapshotPage.header.snapshotApprovalButton.isDisabled).to.equal(true);
    });
  });

  describe('public build notice', function() {
    it('displays when isBuildApprovable is false', function() {
      this.set('isBuildApprovable', false);
      expect(FullSnapshotPage.isPublicBuildNoticeVisible).to.equal(true);
    });
  });
});
