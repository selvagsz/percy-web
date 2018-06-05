import $ from 'jquery';
import {alias, lt, mapBy} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import {inject as service} from '@ember/service';

const KEYS = {
  DOWN_ARROW: 40,
  UP_ARROW: 38,
  D: 68,
};

export default Component.extend({
  classNames: ['SnapshotList'],
  attributeBindings: ['data-test-snapshot-list'],
  'data-test-snapshot-list': true,
  store: service(),
  snapshotQuery: service(),

  // Required params
  snapshotsChanged: null,
  build: null,
  isKeyboardNavEnabled: null,
  showSnapshotFullModalTriggered: null,
  createReview: null,
  allDiffsShown: null,
  toggleAllDiffs: null,
  isUnchangedSnapshotsVisible: null,
  isUnchangedSnapshotsLoading: false,
  snapshotsUnchanged: null,

  // Set internally by actions
  activeSnapshotId: null,

  isDefaultExpanded: lt('snapshotsChanged.length', 150),

  numSnapshotsUnchanged: computed('build.totalSnapshots', 'snapshotsChanged.length', function() {
    return this.get('build.totalSnapshots') - this.get('snapshotsChanged.length');
  }),

  actions: {
    updateActiveSnapshotId(newSnapshotId) {
      this.set('activeSnapshotId', newSnapshotId);
    },
  },

  didInsertElement() {
    $(document).bind(
      'keydown.snapshots',
      function(e) {
        if (this.get('isKeyboardNavEnabled')) {
          if (e.keyCode === KEYS.DOWN_ARROW) {
            this.set('activeSnapshotId', this._calculateNewActiveSnapshotId({isNext: true}));
          } else if (e.keyCode === KEYS.UP_ARROW) {
            this.set('activeSnapshotId', this._calculateNewActiveSnapshotId({isNext: false}));
          } else if (e.keyCode === KEYS.D) {
            e.preventDefault();
            this.get('toggleAllDiffs')({trackSource: 'keypress'});
          }
        }
      }.bind(this),
    );
  },
  willDestroyElement() {
    $(document).unbind('keydown.snapshots');
  },

  _allVisibleSnapshots: computed(
    'snapshotsChanged.[]',
    'snapshotsUnchanged.[]',
    'isUnchangedSnapshotsVisible',
    function() {
      if (this.get('isUnchangedSnapshotsVisible')) {
        return [].concat(this.get('snapshotsChanged'), this.get('snapshotsUnchanged'));
      } else {
        return this.get('snapshotsChanged');
      }
    },
  ),

  _snapshotIds: mapBy('_allVisibleSnapshots', 'id'),
  _numSnapshots: alias('_allVisibleSnapshots.length'),
  _calculateNewActiveSnapshotId({isNext = true} = {}) {
    let currentIndex = this.get('_snapshotIds').indexOf(this.get('activeSnapshotId'));

    // if we are moving forward and are on the last snapshot, wrap to beginning of list
    if (isNext && currentIndex === this.get('_numSnapshots') - 1) {
      currentIndex = -1;
    } else if (!isNext && currentIndex === 0) {
      // if we are moving backward and are on the first snapshot, wrap to end of list
      currentIndex = this.get('_numSnapshots');
    }

    const newIndex = isNext ? currentIndex + 1 : currentIndex - 1;
    return this.get('_snapshotIds')[newIndex];
  },
});
