import {equal, reads} from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['ComparisonViewerFull'],
  comparison: null,
  isBase: equal('comparisonMode', 'base'),
  isHead: equal('comparisonMode', 'head'),
  isDiff: equal('comparisonMode', 'diff'),
  headImage: reads('comparison.headScreenshot.image'),
  diffImage: reads('comparison.diffImage'),
  baseImage: reads('comparison.baseScreenshot.image'),
  click() {
    if (!this.get('comparison') || this.get('comparison.wasAdded')) {
      return;
    }
    this.get('cycleComparisonMode')(39);
  },
});
