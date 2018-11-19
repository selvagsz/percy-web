import InfinityModel from 'ember-infinity/lib/infinity-model';
import utils from 'percy-web/lib/utils';
import {get, set} from '@ember/object';

const ExtendedInfinityModel = InfinityModel.extend({
  buildParams() {
    let params = this._super(...arguments);
    params['page[cursor]'] = get(this, '_cursor'); // where `this` is the infinityModel instance
    return params;
  },

  afterInfinityModel(builds, params) {
    // if the server response is less than the request assume we've loaded all the data
    // >= is used to prevent a race condition where we might load more than the request number of
    // projects due to chunks of data being loaded in many ways.
    const canLoadMore = builds.get('length') >= params.get('perPage');

    set(this, 'canLoadMore', canLoadMore);

    // need to set the pagination cursor based on the oldest continuous build already loaded into
    // the store, not just all the ordered builds. That way the front end will ask for the right
    // builds to make scrolling continuous and seamless, not missing any builds.
    const projectId = builds.get('firstObject.project.id');
    const localBuilds = this.get('store').peekAll('build');
    const filteredBuilds = localBuilds.filter(item => {
      return item.get('project.id') === projectId;
    });

    const sortedCleanLocalBuilds = utils.sortAndCleanBuilds(filteredBuilds);

    const oldestBuildId = sortedCleanLocalBuilds.get('lastObject.id');

    set(this, '_cursor', oldestBuildId);
  },
});

export default ExtendedInfinityModel;
