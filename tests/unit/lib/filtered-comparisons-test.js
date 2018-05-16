import {expect} from 'chai';
import {describe, it} from 'mocha';
import {get} from '@ember/object';
import {
  computeWidestComparison,
  computeComparisonForWidth,
  computeComparisonsForBrowser,
  computeWidestComparisonWithDiff,
  snapshotsWithDiffForBrowser,
  countDiffsWithSnapshotsPerBrowser,
} from 'percy-web/lib/filtered-comparisons';

describe('filtered-comparisons', function() {
  const chromeBrowser = {
    id: 'chrome-id',
  };
  const firefoxBrowser = {
    id: 'firefox-id',
  };

  const narrowComparisonNoDiff = {width: 1, isDifferent: false};
  const narrowComparisonWithDiff = {width: 1, isDifferent: true};
  const wideComparisonNoDiff = {width: 1000, isDifferent: false};
  const wideComparisonWithDiff = {width: 1000, isDifferent: true};

  describe('#computeWidestComparison', function() {
    it('returns widest comparison', function() {
      expect(computeWidestComparison([narrowComparisonNoDiff, wideComparisonNoDiff])).to.equal(
        wideComparisonNoDiff,
      );
    });
  });

  describe('#computeCompraisonForWidth', function() {
    it('returns comparison matching inputted width', function() {
      expect(
        computeComparisonForWidth([narrowComparisonNoDiff, wideComparisonNoDiff], 1000),
      ).to.equal(wideComparisonNoDiff);
    });

    it('returns nothing if there is no matching comparison', function() {
      expect(
        computeComparisonForWidth([narrowComparisonNoDiff, wideComparisonNoDiff], 293847),
      ).to.equal(undefined);
    });
  });

  describe('#computeComparisonsForBrowser', function() {
    it('returns comparisons with maching browser', function() {
      const chromeComparison = {browser: chromeBrowser};
      const firefoxComparison = {browser: firefoxBrowser};

      expect(
        computeComparisonsForBrowser([firefoxComparison, chromeComparison], chromeBrowser),
      ).to.eql([chromeComparison]);
    });

    it('returns empty array if no matching comparisons', function() {
      expect(
        computeComparisonsForBrowser([narrowComparisonNoDiff, wideComparisonNoDiff], chromeBrowser),
      ).to.eql([]);
    });
  });

  describe('#computeWidestComparisonWithDiff', function() {
    it('returns widest comparison with diff', function() {
      expect(
        computeWidestComparisonWithDiff([
          narrowComparisonWithDiff,
          wideComparisonWithDiff,
          wideComparisonNoDiff,
        ]),
      ).to.equal(wideComparisonWithDiff);
    });

    it('returns undefined if no comparisons with diffs', function() {
      expect(
        computeWidestComparisonWithDiff([narrowComparisonNoDiff, wideComparisonNoDiff]),
      ).to.equal(undefined);
    });
  });

  describe('#snapshotsWithDiffForBrowser', function() {
    it('returns snapshots which have comparisons with diffs for matching browser', function() {
      const chromeComparisonWithDiff = {browser: chromeBrowser, isDifferent: true};
      const firefoxComparisonWithDiff = {browser: firefoxBrowser, isDifferent: true};
      const chromeComparisonNoDiff = {browser: chromeBrowser, isDifferent: false};

      const snapshotWithChrome = {comparisons: [chromeComparisonWithDiff]};
      const snapshotWithFirefox = {comparisons: [firefoxComparisonWithDiff]};
      const snapshotWithBothBrowsersAndDiffs = {
        comparisons: [chromeComparisonWithDiff, firefoxComparisonWithDiff],
      };
      const snapshotWithBothBrowsersAndMixedDiffs = {
        comparisons: [chromeComparisonNoDiff, firefoxComparisonWithDiff],
      };

      const allSnapshots = [
        snapshotWithChrome,
        snapshotWithFirefox,
        snapshotWithBothBrowsersAndDiffs,
        snapshotWithBothBrowsersAndMixedDiffs,
      ];
      let snapshots = snapshotsWithDiffForBrowser(allSnapshots, chromeBrowser);
      expect(snapshots).to.eql([snapshotWithChrome, snapshotWithBothBrowsersAndDiffs]);
    });
  });

  describe('#countDiffsWithSnapshotsPerBrowser', function() {
    it('creates correct data structure', function() {
      const snapshotWithTwoChromeDiffs = {
        comparisons: [
          {browser: chromeBrowser, isDifferent: true},
          {browser: chromeBrowser, isDifferent: true},
          {browser: firefoxBrowser, isDifferent: false},
        ],
      };

      const mixedSnapshotWithFirefoxDiff = {
        comparisons: [
          {browser: chromeBrowser, isDifferent: false},
          {browser: firefoxBrowser, isDifferent: true},
        ],
      };
      const snapshotWithFirefoxDiff = {
        comparisons: [{browser: firefoxBrowser, isDifferent: true}],
      };

      const result = countDiffsWithSnapshotsPerBrowser(
        [snapshotWithTwoChromeDiffs, mixedSnapshotWithFirefoxDiff, snapshotWithFirefoxDiff],
        [chromeBrowser, firefoxBrowser],
      );
      expect(get(result, 'firefox-id')).to.eql([
        mixedSnapshotWithFirefoxDiff,
        snapshotWithFirefoxDiff,
      ]);
      expect(get(result, 'chrome-id')).to.eql([snapshotWithTwoChromeDiffs]);
    });
  });
});
