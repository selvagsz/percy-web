import {expect} from 'chai';
import {describe, beforeEach, it} from 'mocha';
import snapshotSort from 'percy-web/lib/snapshot-sort';
import {set} from '@ember/object';

describe('snapshot-sort', function() {
  const wideWidth = 800;
  const narrowWidth = 400;

  const highDiffRatio = 0.99;
  const lowDiffRatio = 0.25;
  const noDiffRatio = 0.0;

  const firefoxBrowser = {id: 'firefox'};
  const chromeBrowser = {id: 'chrome'};

  let wideComparisonWithHighDiff;
  let narrowComparisonWithHighDiff;
  let wideComparisonWithLowDiff;
  let wideComparisonWithNoDiff;

  beforeEach(() => {
    wideComparisonWithHighDiff = {
      width: wideWidth,
      smartDiffRatio: highDiffRatio,
      browser: firefoxBrowser,
    };
    narrowComparisonWithHighDiff = {
      width: narrowWidth,
      smartDiffRatio: highDiffRatio,
      browser: firefoxBrowser,
    };
    wideComparisonWithLowDiff = {
      width: wideWidth,
      smartDiffRatio: lowDiffRatio,
      browser: firefoxBrowser,
    };
    wideComparisonWithNoDiff = {
      width: wideWidth,
      smartDiffRatio: noDiffRatio,
      browser: firefoxBrowser,
    };
  });

  describe('when comparisons have mixed browsers', function() {
    it('returns snapshots with highest diff ratio in active browser first', function() {
      set(wideComparisonWithLowDiff, 'browser', chromeBrowser);
      const snapshotWithLowDiffInActiveBrowser = {
        comparisons: [wideComparisonWithLowDiff],
      };
      const snapshotWithHighDiffInInactiveBrowser = {
        comparisons: [wideComparisonWithHighDiff],
      };

      expect(
        snapshotSort(
          [snapshotWithHighDiffInInactiveBrowser, snapshotWithLowDiffInActiveBrowser],
          chromeBrowser,
        ),
      ).to.eql([snapshotWithLowDiffInActiveBrowser, snapshotWithHighDiffInInactiveBrowser]);
    });

    it('returns snapshots with widest comparisons in active browser first', function() {
      set(narrowComparisonWithHighDiff, 'browser', chromeBrowser);
      const snapshotWithNarrowWidthInActiveBrowser = {
        comparisons: [narrowComparisonWithHighDiff],
      };
      const snapshotWithWideWidthInActiveBrowser = {
        comparisons: [wideComparisonWithHighDiff],
      };

      expect(
        snapshotSort(
          [snapshotWithWideWidthInActiveBrowser, snapshotWithNarrowWidthInActiveBrowser],
          chromeBrowser,
        ),
      ).to.eql([snapshotWithNarrowWidthInActiveBrowser, snapshotWithWideWidthInActiveBrowser]);
    });
  });

  describe('when all comparisons have the same browser', function() {
    it('returns snapshots with diffs before snapshots with no diffs', function() {
      const snapshotWithDiffs = {comparisons: [wideComparisonWithLowDiff]};
      const snapshotWithNoDiffs = {comparisons: [wideComparisonWithNoDiff]};
      const unorderedSnapshots = [snapshotWithNoDiffs, snapshotWithDiffs];

      expect(snapshotSort(unorderedSnapshots, firefoxBrowser)).to.eql([
        snapshotWithDiffs,
        snapshotWithNoDiffs,
      ]);
    });

    it('returns snapshots with diffs at widest widths before snapshots with no diffs at widest width', function() { // eslint-disable-line
      const snapshotWithWideDiff = {
        maxComparisonWidth: wideWidth,
        comparisons: [wideComparisonWithHighDiff],
      };
      const snapshotWithNarrowDiff = {
        maxComparisonWidth: narrowWidth,
        comparisons: [narrowComparisonWithHighDiff],
      };
      const unorderedSnapshots = [snapshotWithNarrowDiff, snapshotWithWideDiff];

      expect(snapshotSort(unorderedSnapshots, firefoxBrowser)).to.eql([
        snapshotWithWideDiff,
        snapshotWithNarrowDiff,
      ]);
    });

    it('returns snapshots with high diff ratio before snapshots with low diff ratio', function() {
      const snapshotWithHighDiffRatio = {
        maxComparisonWidth: wideWidth,
        comparisons: [wideComparisonWithHighDiff],
      };
      const snapshotWithLowDiffRatio = {
        maxComparisonWidth: wideWidth,
        comparisons: [wideComparisonWithLowDiff],
      };
      const unorderedSnapshots = [snapshotWithLowDiffRatio, snapshotWithHighDiffRatio];

      expect(snapshotSort(unorderedSnapshots, firefoxBrowser)).to.eql([
        snapshotWithHighDiffRatio,
        snapshotWithLowDiffRatio,
      ]);
    });
  });
});
