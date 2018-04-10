import {alias} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['SnapshotViewerFull'],
  attributeBindings: ['data-test-snapshot-viewer-full'],
  'data-test-snapshot-viewer-full': true,

  // Required params
  snapshot: null,
  snapshotSelectedWidth: null,
  comparisonMode: null,
  updateComparisonMode: null,
  transitionRouteToWidth: null,
  closeSnapshotFullModal: null,
  createReview: null,

  galleryMap: ['base', 'diff', 'head'],

  galleryIndex: computed('comparisonMode', function() {
    return this.get('galleryMap').indexOf(this.get('comparisonMode'));
  }),

  comparisons: alias('snapshot.comparisons'),

  selectedComparison: computed('snapshot.widestComparison', 'snapshotSelectedWidth', function() {
    return (
      this.get('snapshot').comparisonForWidth(this.get('snapshotSelectedWidth')) ||
      this.get('snapshot.widestComparison')
    );
  }),

  didRender() {
    this._super(...arguments);

    // Autofocus component for keyboard navigation
    this.$().attr({tabindex: 1});
    this.$().focus();
  },

  actions: {
    updateSelectedWidth(value) {
      const comparison = this.get('snapshot').comparisonForWidth(value);

      this.set('selectedComparison', comparison);
      this.set('snapshotSelectedWidth', value);

      this.sendAction(
        'transitionRouteToWidth',
        this.get('snapshot'),
        value,
        this.get('comparisonMode'),
      );
    },

    cycleComparisonMode(keyCode) {
      let galleryMap = this.get('galleryMap');
      let galleryLength = this.get('galleryMap.length');
      let directional = keyCode === 39 ? 1 : -1;
      let galleryIndex = this.get('galleryIndex');
      let newIndex = ((galleryIndex + directional) % galleryLength + galleryLength) % galleryLength;
      this.sendAction('updateComparisonMode', galleryMap[newIndex]);
    },
  },

  keyDown(event) {
    if (event.keyCode === 27) {
      this.get('closeSnapshotFullModal')();
    }

    if (event.keyCode === 39 || event.keyCode === 37) {
      if (!this.get('selectedComparison') || this.get('selectedComparison.wasAdded')) {
        return;
      }
      this.send('cycleComparisonMode', event.keyCode);
    }
  },
});
