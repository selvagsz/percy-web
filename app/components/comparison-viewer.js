import {computed, observer} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  // Arguments:
  comparison: null,
  allDiffsShown: null,

  // State:
  classNames: ['ComparisonViewer bg-gray-000 border-bottom border-gray-100'],
  isUnchangedSnapshotExpanded: false,

  // The state of showing the diff overlay is local to each comparison viewer.
  showDiffOverlay: true,

  // If the global all diffs toggle is triggered, reset our own state to match the global state.
  // This is intentional an observer instead of a computed property. We want to the state of
  // showDiffOverlay loosely coupled to both a local action and the global diff toggle action.
  handleAllDiffsToggle: observer('allDiffsShown', function() {
    this.set('showDiffOverlay', this.get('allDiffsShown'));
  }),

  comparisonUrl: computed(function() {
    return `?comparison=${this.get('comparison.id')}`;
  }),

  actions: {
    toggleOverlay() {
      this.toggleProperty('showDiffOverlay');

      const build = this.get('comparison.headBuild');
      const organization = build.get('project.organization');
      const eventProperties = {
        project_id: build.get('project.id'),
        project_slug: build.get('project.slug'),
        build_id: build.get('id'),
        state: this.get('showDiffOverlay') ? 'on' : 'off',
        source: 'clicked_overlay',
      };
      this.get('analytics').track('Diff Toggled', organization, eventProperties);
    },
    expandUnchangedSnapshot() {
      this.toggleProperty('isUnchangedSnapshotExpanded');
    },
  },
});
