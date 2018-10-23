import Component from '@ember/component';
import PollingMixin from 'percy-web/mixins/polling';

export default Component.extend(PollingMixin, {
  project: null,
  showQuickstart: false,
  tagName: 'main',
  classNames: ['project-container flex-1 border-l pb-8'],
  attributeBindings: ['data-test-project-container'],
  'data-test-project-container': true,

  _refresh() {
    this.set('isRefreshing', true);
    this.get('project')
      .reload()
      .then(project => {
        project
          .get('builds')
          .reload()
          .then(() => {
            if (!this.isDestroyed) {
              this.set('isRefreshing', false);
            }
          });
      });
  },

  shouldPollForUpdates: true,
  POLLING_INTERVAL_SECONDS: 10,
  pollRefresh() {
    return this._refresh();
  },

  actions: {
    refresh() {
      this._refresh();
    },
  },
});
