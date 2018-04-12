import Ember from 'ember';
import {not, alias, or} from '@ember/object/computed';
import {computed, observer} from '@ember/object';
import Component from '@ember/component';
import {next} from '@ember/runloop';

export default Component.extend({
  snapshot: null,
  activeSnapshotId: null,
  allDiffsShown: null,

  classNames: ['SnapshotViewer mb-2'],
  classNameBindings: [
    'isFocus:SnapshotViewer--focus',
    'isExpanded::SnapshotViewer--collapsed',
    'isActionable:SnapshotViewer--actionable',
  ],
  attributeBindings: ['data-test-snapshot-viewer'],
  'data-test-snapshot-viewer': true,

  comparisons: alias('snapshot.comparisons'),

  snapshotSelectedWidth: or('userSelectedWidth', 'defaultWidth'),
  userSelectedWidth: null,

  defaultWidth: or('snapshot.maxComparisonWidthWithDiff', 'snapshot.maxComparisonWidth'),

  selectedComparison: computed('snapshot.widestComparison', 'snapshotSelectedWidth', function() {
    return (
      this.get('snapshot').comparisonForWidth(this.get('snapshotSelectedWidth')) ||
      this.get('snapshot.widestComparison')
    );
  }),

  isActiveSnapshot: computed('activeSnapshotId', 'snapshot.id', function() {
    return this.get('activeSnapshotId') === this.get('snapshot.id');
  }),

  _shouldScroll: true,
  _scrollToTop: observer('isActiveSnapshot', function() {
    if (this.get('_shouldScroll') && this.get('isActiveSnapshot') && !Ember.testing) {
      if (this.get('snapshot.isUnchanged')) {
        this.setProperties({
          isExpanded: true,
          isUnchangedSnapshotExpanded: true,
        });
      }
      // Wait a tick for the above properties to be set on unchanged snapshots, so the snapshot will
      // become fully expanded before scrolling. If we didn't wait for this, the component would
      // scroll to a height based on the closed snapshot viewer height rather than the opened one.
      next(() => {
        window.scrollTo(0, this.$().get(0).offsetTop - 48); // 48px - snapshot viewer header height
      });
    }
    this.set('_shouldScroll', true);
  }),

  isDefaultExpanded: true,
  isFocus: alias('isActiveSnapshot'),
  isExpanded: or('isUserExpanded', '_isDefaultExpanded'),
  isUserExpanded: false,

  _isDefaultExpanded: computed(
    'isDefaultExpanded',
    'snapshot.isApproved',
    'build.isApproved',
    'isActiveSnapshot',
    function() {
      if (this.get('isActiveSnapshot') || this.get('build.isApproved')) {
        return true;
      } else if (this.get('snapshot.isApproved')) {
        return false;
      } else {
        return this.get('isDefaultExpanded');
      }
    },
  ),
  isNotExpanded: not('isExpanded'),
  isActionable: alias('isNotExpanded'),
  isUnchangedSnapshotExpanded: or('isFocus', 'isExpanded'),

  click() {
    this.set('_shouldScroll', false);
    this.get('updateActiveSnapshotId')(this.get('snapshot.id'));
  },

  actions: {
    updateSelectedWidth(value) {
      this.set('userSelectedWidth', value);
    },
    expandSnapshot() {
      if (!this.get('_defaultIsExpanded')) {
        this.set('isUserExpanded', true);
      }
    },
  },
});
