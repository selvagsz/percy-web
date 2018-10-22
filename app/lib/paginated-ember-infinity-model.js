import InfinityModel from 'ember-infinity/lib/infinity-model';
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
    // assumes list from server is ordered starting with most recent build
    const canLoadMore = builds.get('length') >= params.get('perPage');

    set(this, 'canLoadMore', canLoadMore);
    set(this, '_cursor', builds.get('lastObject.id'));
  },
});

export default ExtendedInfinityModel;
