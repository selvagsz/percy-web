import {setupRenderingTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make, makeList} from 'ember-data-factory-guy';
import sinon from 'sinon';
import DS from 'ember-data';
import {defer} from 'rsvp';
import BuildPage from 'percy-web/tests/pages/build-page';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import mockSnapshotQueryService from 'percy-web/tests/helpers/mock-snapshot-query-service';

describe('Integration: BuildContainer', function() {
  setupRenderingTest('build-container', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    BuildPage.setContext(this);
  });

  describe('snapshot display during different build states', function() {
    beforeEach(async function() {
      const build = make('build', 'withBaseBuild', {buildNumber: 1});
      const snapshotsChanged = [make('snapshot', 'withComparisons', {build})];
      const allChangedBrowserSnapshotsSorted = {firefox: snapshotsChanged};
      const browser = make('browser');
      const stub = sinon.stub();

      this.setProperties({build, allChangedBrowserSnapshotsSorted, stub, browser});

      // Override the pollRefresh method for the test. This does not happen IRL,
      // but we can't have the component make requests in this integration test
      await this.render(hbs`{{build-container
        build=build
        createReview=stub
        pollRefresh=stub
        allChangedBrowserSnapshotsSorted=allChangedBrowserSnapshotsSorted
      }}`);
    });

    it('does not display snapshots while build is processing', async function() {
      this.set('build.state', 'processing');
      this.set('build.totalComparisons', 2312);
      this.set('build.totalComparisonsFinished', 2187);

      await percySnapshot(this.test.fullTitle());
      expect(BuildPage.snapshotList.isVisible).to.equal(false);
    });

    it('does not display snapshots while build is pending', async function() {
      this.set('build.state', 'pending');

      await percySnapshot(this.test.fullTitle());
      expect(BuildPage.snapshotList.isVisible).to.equal(false);
    });

    it('does not display snapshots when build is failed', async function() {
      const failedBuild = make('build', 'withBaseBuild', 'failed');
      this.set('build', failedBuild);

      await percySnapshot(this.test.fullTitle());
      expect(BuildPage.snapshotList.isVisible).to.equal(false);
    });

    it('does not display snapshots when build is expired', async function() {
      this.set('build.state', 'expired');

      await percySnapshot(this.test.fullTitle());
      expect(BuildPage.snapshotList.isVisible).to.equal(false);
    });
  });

  it('does not display snapshots when isSnapshotsLoading is true', async function() {
    const build = make('build', 'withBaseBuild', 'finished');
    const snapshotsChanged = DS.PromiseArray.create({promise: defer().promise});
    const allChangedBrowserSnapshotsSorted = {'firefox-id': snapshotsChanged};

    this.setProperties({build, allChangedBrowserSnapshotsSorted});

    await this.render(hbs`{{build-container
      build=build
      isSnapshotsLoading=true
      createReview=stub
      allChangedBrowserSnapshotsSorted=allChangedBrowserSnapshotsSorted
    }}`);

    await percySnapshot(this.test.fullTitle());
    expect(BuildPage.snapshotList.isVisible).to.equal(false);
  });

  it('displays snapshots when build is finished', async function() {
    const build = make('build', 'withBaseBuild', 'finished');
    const diffSnapshot = make('snapshot', 'withComparisons', {build});
    const allChangedBrowserSnapshotsSorted = {'firefox-id': [diffSnapshot]};
    const stub = sinon.stub();
    this.setProperties({
      build,
      stub,
      allChangedBrowserSnapshotsSorted,
    });

    await this.render(hbs`{{build-container
      build=build
      allChangedBrowserSnapshotsSorted=allChangedBrowserSnapshotsSorted
      createReview=stub
    }}`);
    await percySnapshot(this.test.fullTitle());

    expect(BuildPage.snapshotList.isVisible).to.equal(true);
    expect(BuildPage.snapshotList.snapshots().count).to.equal(1);
    expect(BuildPage.snapshotList.isNoDiffsBatchVisible).to.equal(true);
  });

  it('shows loading indicator while fetching unchanged diffs', async function() {
    const stub = sinon.stub();
    const build = make('build', 'withBaseBuild', 'finished');
    const allChangedBrowserSnapshotsSorted = {'firefox-id': []};

    mockSnapshotQueryService(this, defer().promise);

    this.setProperties({
      allChangedBrowserSnapshotsSorted,
      build,
      stub,
    });

    await this.render(hbs`{{build-container
      build=build
      allChangedBrowserSnapshotsSorted=allChangedBrowserSnapshotsSorted
      createReview=stub
    }}`);

    await BuildPage.snapshotList.clickToggleNoDiffsSection();
    await percySnapshot(this.test);
  });

  it('gets snapshots with no diffs after expanding no diffs section', async function() {
    const stub = sinon.stub();
    const build = make('build', 'withBaseBuild', 'finished');
    const allChangedBrowserSnapshotsSorted = {'firefox-id': []};
    const numSnapshotsUnchanged = 3;
    const snapshotsUnchanged = makeList('snapshot', numSnapshotsUnchanged, 'withNoDiffs', {build});

    mockSnapshotQueryService(this, snapshotsUnchanged);

    this.setProperties({
      allChangedBrowserSnapshotsSorted,
      build,
      stub,
    });

    await this.render(hbs`{{build-container
      build=build
      allChangedBrowserSnapshotsSorted=allChangedBrowserSnapshotsSorted
      createReview=stub
    }}`);

    expect(BuildPage.snapshotList.isNoDiffsBatchVisible).to.equal(true);
    await BuildPage.snapshotList.clickToggleNoDiffsSection();

    expect(BuildPage.snapshotList.isNoDiffsBatchVisible).to.equal(false);
    expect(BuildPage.snapshotList.snapshots().count).to.equal(numSnapshotsUnchanged);
  });

  describe('when a build has more than one browser', function() {
    beforeEach(async function() {
      const build = make('build', 'withBaseBuild', 'finished', 'withTwoBrowsers');
      const comparisonWithBigDiffInFirefox = make('comparison', {
        build,
        diffRatio: 0.9,
      });
      const comparisonWithSmallDiffInFirefox = make('comparison', {
        build,
        diffRatio: 0.3,
      });
      const comparisonWithNoDiffInFirefox = make('comparison', {
        build,
        diffRatio: 0,
      });
      const comparisonWithBigDiffInChrome = make('comparison', 'forChrome', {
        build,
        diffRatio: 0.8,
      });
      const comparisonWithNoDiffInChrome = make('comparison', 'forChrome', {build, diffRatio: 0});

      const snapshotWithDiffInFirefoxOnly = make('snapshot', {
        build,
        comparisons: [comparisonWithNoDiffInChrome, comparisonWithBigDiffInFirefox],
      });
      const snapshotWithDiffInBothBrowsers = make('snapshot', {
        build,
        comparisons: [comparisonWithBigDiffInChrome, comparisonWithSmallDiffInFirefox],
      });
      const unchangedSnapshot = make('snapshot', 'withNoDiffs', {
        build,
        comparisons: [comparisonWithNoDiffInChrome, comparisonWithNoDiffInFirefox],
      });

      const allChangedBrowserSnapshotsSorted = {
        'firefox-id': [snapshotWithDiffInFirefoxOnly, snapshotWithDiffInBothBrowsers],
        'chrome-id': [snapshotWithDiffInBothBrowsers],
      };

      const stub = sinon.stub();

      // Don't use the analytics service.
      const analyticsStub = {
        track: stub,
      };

      mockSnapshotQueryService(this, [unchangedSnapshot]);

      this.setProperties({
        build,
        allChangedBrowserSnapshotsSorted,
        stub,
        snapshotWithDiffInBothBrowsers,
        analyticsStub,
      });
      await this.render(hbs`{{build-container
        build=build
        allChangedBrowserSnapshotsSorted=allChangedBrowserSnapshotsSorted
        createReview=stub
        analytics=analyticsStub
      }}`);
    });

    it('decrements browser count badge when a snapshot is approved', async function() {
      expect(BuildPage.browserSwitcher.chromeButton.diffCount).to.equal('1');
      expect(BuildPage.browserSwitcher.firefoxButton.diffCount).to.equal('2');

      this.set('snapshotWithDiffInBothBrowsers.reviewState', 'approved');

      expect(BuildPage.browserSwitcher.chromeButton.isAllApproved).to.equal(true);
      expect(BuildPage.browserSwitcher.firefoxButton.diffCount).to.equal('1');
    });

    it('shows unchanged snapshots when it is toggled', async function() {
      expect(BuildPage.isUnchangedPanelVisible).to.equal(true);
      expect(BuildPage.snapshots().count).to.equal(2);
      await BuildPage.clickToggleNoDiffsSection();

      expect(BuildPage.isUnchangedPanelVisible).to.equal(false);
      expect(BuildPage.snapshots().count).to.equal(3);
    });

    it('resets unchanged snapshots when unchanged snapshots are visible and browser is switched', async function() { // eslint-disable-line
      await BuildPage.clickToggleNoDiffsSection();
      expect(BuildPage.isUnchangedPanelVisible).to.equal(false);
      await BuildPage.browserSwitcher.switchBrowser();

      expect(BuildPage.isUnchangedPanelVisible).to.equal(true);
      expect(BuildPage.snapshots().count).to.equal(1);
      await BuildPage.clickToggleNoDiffsSection();

      expect(BuildPage.snapshots().count).to.equal(3);
    });

    it('selects browser with most diffs by default', async function() {
      expect(BuildPage.browserSwitcher.chromeButton.isActive).to.equal(false);
      expect(BuildPage.browserSwitcher.firefoxButton.isActive).to.equal(true);
    });

    it('selects chrome by default when both browsers have equal snapshots with diffs', async function() { // eslint-disable-line
      this.set('allChangedBrowserSnapshotsSorted', {'chrome-id': ['bar'], 'firefox-id': ['foo']});

      expect(BuildPage.browserSwitcher.chromeButton.isActive).to.equal(true);
      expect(BuildPage.browserSwitcher.firefoxButton.isActive).to.equal(false);
    });
  });

  describe('when isBuildApprovable is false', function() {
    beforeEach(async function() {
      const build = make('build', 'withBaseBuild', 'finished');
      const diffSnapshot = make('snapshot', 'withComparisons', {build});
      const allChangedBrowserSnapshotsSorted = {'firefox-id': [diffSnapshot]};
      const stub = sinon.stub();
      const isBuildApprovable = false;
      this.setProperties({
        build,
        stub,
        allChangedBrowserSnapshotsSorted,
        isBuildApprovable,
      });

      await this.render(hbs`{{build-container
        build=build
        allChangedBrowserSnapshotsSorted=allChangedBrowserSnapshotsSorted
        createReview=stub
        isBuildApprovable=isBuildApprovable
      }}`);
    });

    it('displays notice that build is public', async function() {
      expect(BuildPage.isPublicBuildNoticeVisible).to.equal(true);
      await percySnapshot(this.test);
    });
  });
});
