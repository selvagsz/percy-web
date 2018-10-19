import Route from '@ember/routing/route';
import metaTagLookup from 'percy-web/lib/meta-tags';
import $ from 'jquery';
import {hash} from 'rsvp';

export default Route.extend({
  headTags: metaTagLookup('team'),

  model() {
    return hash({
      page: this.get('store').queryRecord('marketing-page', {
        'fields.pageName': 'Team',
      }),
      jobs: this._getJobPosts(),
    });
  },

  setupController(controller, resolvedModel) {
    controller.setProperties({
      model: resolvedModel.page,
      jobs: resolvedModel.jobs,
    });
  },

  _getJobPosts() {
    return $.get('https://api.lever.co/v0/postings/percy');
  },
});
