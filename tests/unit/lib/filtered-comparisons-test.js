import {expect} from 'chai';
import {describe, it} from 'mocha';
import {get} from '@ember/object';
import {
  widestComparison,
  comparisonForWidth,
  comparisonsForBrowser,
  widestComparisonWithDiff,
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

  describe('#widestComparison', function() {
    it('returns widest comparison', function() {
      expect(widestComparison([narrowComparisonNoDiff, wideComparisonNoDiff])).to.equal(
        wideComparisonNoDiff,
      );
    });

    it('returns undefined when comparisons is not defined', function() {
      expect(widestComparison()).to.equal(undefined);
    });
  });

  describe('#computeCompraisonForWidth', function() {
    it('returns comparison matching inputted width', function() {
      expect(comparisonForWidth([narrowComparisonNoDiff, wideComparisonNoDiff], 1000)).to.equal(
        wideComparisonNoDiff,
      );
    });

    it('returns nothing if there is no matching comparison', function() {
      expect(comparisonForWidth([narrowComparisonNoDiff, wideComparisonNoDiff], 293847)).to.equal(
        undefined,
      );
    });

    it('returns undefined when comparisons and width is not defined', function() {
      expect(comparisonForWidth()).to.equal(undefined);
    });
  });

  describe('#comparisonsForBrowser', function() {
    it('returns comparisons with maching browser', function() {
      const chromeComparison = {browser: chromeBrowser};
      const firefoxComparison = {browser: firefoxBrowser};

      expect(comparisonsForBrowser([firefoxComparison, chromeComparison], chromeBrowser)).to.eql([
        chromeComparison,
      ]);
    });

    it('returns empty array if no matching comparisons', function() {
      expect(
        comparisonsForBrowser([narrowComparisonNoDiff, wideComparisonNoDiff], chromeBrowser),
      ).to.eql([]);
    });

    it('returns empty array if browser is defined but comparisons is not', function() {
      expect(comparisonsForBrowser(undefined, chromeBrowser)).to.eql([]);
    });

    it('returns empty array if comparisons is defined but browser is not', function() {
      const chromeComparison = {browser: chromeBrowser};
      const firefoxComparison = {browser: firefoxBrowser};
      expect(comparisonsForBrowser([firefoxComparison, chromeComparison])).to.eql([]);
    });
  });

  describe('#widestComparisonWithDiff', function() {
    it('returns widest comparison with diff', function() {
      expect(
        widestComparisonWithDiff([
          narrowComparisonWithDiff,
          wideComparisonWithDiff,
          wideComparisonNoDiff,
        ]),
      ).to.equal(wideComparisonWithDiff);
    });

    it('returns undefined if no comparisons with diffs', function() {
      expect(widestComparisonWithDiff([narrowComparisonNoDiff, wideComparisonNoDiff])).to.equal(
        undefined,
      );
    });

    it('returns undefined if comparisons is not defined', function() {
      expect(widestComparisonWithDiff()).to.eql(undefined);
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

    it('returns empty array if comparisons and browser are not defined', function() {
      expect(snapshotsWithDiffForBrowser()).to.eql([]);
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
