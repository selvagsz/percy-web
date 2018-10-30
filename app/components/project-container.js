import Component from '@ember/component';
import PollingMixin from 'percy-web/mixins/polling';
import {inject as service} from '@ember/service';
import ExtendedInfinityModel from 'percy-web/lib/paginated-ember-infinity-model';

export default Component.extend(PollingMixin, {
  infinity: service(),
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
        this.infinity.model(
          'build',
          {
            project: project,
            perPage: 50,
            perPageParam: 'page[limit]',
            pageParam: null,
          },
          ExtendedInfinityModel,
        );
        // project
        //   .get('builds')
        //   .reload()
        //   .then(() => {
        //     if (!this.isDestroyed) {
        //       this.set('isRefreshing', false);
        //     }
        //   });
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
