import Component from '@ember/component';
import PollingMixin from 'percy-web/mixins/polling';
import utils from 'percy-web/lib/utils';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';

import {INFINITY_SCROLL_LIMIT} from 'percy-web/models/build';

export default Component.extend(PollingMixin, {
  store: service(),

  project: null,
  showQuickstart: false,
  tagName: 'main',
  classNames: ['project-container flex-1 border-l pb-8'],
  attributeBindings: ['data-test-project-container'],
  'data-test-project-container': true,
  buildsLimit: INFINITY_SCROLL_LIMIT,

  canLoadMore: computed.not('infinityBuilds.reachedInfinity'),

  async _refresh() {
    this.set('isRefreshing', true);
    const project = await this.get('project').reload();
    const buildCount = this.get('buildsLimit');

    // reload the builds by querying the api with a limit, otherwise running
    // builds.reload() here hits the api without a limit and returns 100 builds
    await this.get('store').query('build', {project: project, 'page[limit]': buildCount});

    if (!this.isDestroyed) {
      this.set('isRefreshing', false);
    }
  },

  shouldPollForUpdates: true,
  POLLING_INTERVAL_SECONDS: 10,
  pollRefresh() {
    return this._refresh();
  },

  builds: computed('isRefreshing', 'infinityBuilds._loadingMore', function() {
    const builds = this.get('store').peekAll('build');

    const filteredBuilds = builds.filter(item => {
      return item.get('project.id') === this.get('project.id');
    });

    return utils.sortAndCleanBuilds(filteredBuilds);
  }),

  actions: {
    refresh() {
      this._refresh();
    },
  },
});
