import {comparisonsForBrowser, comparisonForWidth} from 'percy-web/lib/filtered-comparisons';
import {get} from '@ember/object';

export default function(snapshots, browser) {
  let width = _maxWidthForSnapshots(snapshots);

  return snapshots.sort(function(a, b) {
    // Prioritize snapshots with diffs at any widths over snapshots with no diffs at any widths
    const browserComparisonsForA = comparisonsForBrowser(get(a, 'comparisons'), browser);
    const browserComparisonsForB = comparisonsForBrowser(get(b, 'comparisons'), browser);

    let maxDiffRatioA = _maxDiffRatioAnyWidth(browserComparisonsForA);
    let maxDiffRatioB = _maxDiffRatioAnyWidth(browserComparisonsForB);

    let aHasDiffs = maxDiffRatioA > 0;
    let bHasDiffs = maxDiffRatioB > 0;

    let aHasNoDiffs = maxDiffRatioA == 0;
    let bHasNoDiffs = maxDiffRatioB == 0;

    if (aHasDiffs && bHasNoDiffs) {
      return -1;
    } else if (bHasDiffs && aHasNoDiffs) {
      return 1;
    }

    // Next prioritize snapshots with comparisons at the current width
    let comparisonForA = comparisonForWidth(browserComparisonsForA, width);
    let comparisonForB = comparisonForWidth(browserComparisonsForB, width);

    let aHasNoComparisonAtWidth = !comparisonForA;
    let bHasNoComparisonAtWidth = !comparisonForB;

    if (comparisonForA && bHasNoComparisonAtWidth) {
      return -1;
    } else if (comparisonForB && aHasNoComparisonAtWidth) {
      return 1;
    } else if (comparisonForA && comparisonForB) {
      // Both snapshots have a comparison for the current width, sort by diff percentage.
      return get(comparisonForB, 'smartDiffRatio') - get(comparisonForA, 'smartDiffRatio');
    }

    // Finally, sort by diff ratio across all widths.
    // Sorts descending.
    return maxDiffRatioB + maxDiffRatioA;
  });
}

function _maxWidthForSnapshots(snapshots) {
  return Math.max(...snapshots.mapBy('maxComparisonWidth'));
}

function _maxDiffRatioAnyWidth(comparisons) {
  let comparisonWidths = comparisons.mapBy('smartDiffRatio').filter(x => x);
  return Math.max(0, ...comparisonWidths); // Provide minimum of one param to avoid -Infinity
}
