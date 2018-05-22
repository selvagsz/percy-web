import {or} from '@ember/object/computed';
import Component from '@ember/component';
import {computed, get} from '@ember/object';
import {alias} from '@ember/object/computed';
import {htmlSafe} from '@ember/string';

export default Component.extend({
  build: null,
  classNames: ['BuildHeader'],

  buildCompletionPercent: alias('build.buildCompletionPercent'),

  progressBarWidth: computed('buildCompletionPercent', function() {
    return `${get(this, 'buildCompletionPercent') - 100}%`;
  }),

  progressBarWidthStyle: computed('progressBarWidth', function() {
    return htmlSafe(`--progress-bar-width: ${get(this, 'progressBarWidth')}`);
  }),

  showActions: or('build.isPending', 'build.isProcessing', 'build.isFinished'),

  formattedFailedSnapshots: computed('build.failureDetails', function() {
    return '"' + get(this, 'build.failureDetails').failed_snapshots.join('", "') + '"';
  }),
});
