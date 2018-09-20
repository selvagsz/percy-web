import Route from '@ember/routing/route';
import localStorageProxy from 'percy-web/lib/localstorage';
import {inject as service} from '@ember/service';
import {readOnly} from '@ember/object/computed';
import {task} from 'ember-concurrency';
import handleOptionalAuthGetError from 'percy-web/lib/handle-optionally-authenticated-fetch-error';

export default Route.extend({
  session: service(),
  store: service(),
  currentUser: readOnly('session.currentUser'),

  async beforeModel(transition) {
    const currentUser = this.get('currentUser');

    try {
      // If we get a project, it is accessible to whoever's asking for it. Keep going.
      const project = await this.get('_getProject').perform(transition.params);
      this.set('_project', project);
      return this._super(...arguments);
    } catch (e) {
      return handleOptionalAuthGetError(e, currentUser, this);
    }
  },

  model() {
    // set by beforeModel, if successful.
    return this.get('_project');
  },

  afterModel(model) {
    let recentProjects = localStorageProxy.get('recentProjectSlugs') || {};
    recentProjects[model.get('organization.slug')] = model.get('slug');
    localStorageProxy.set('recentProjectSlugs', recentProjects);
  },

  _getProject: task(function*(params) {
    const projectSlug = params['organization.project'].project_id;
    const preLoadedProject = this.get('store')
      .peekAll('project')
      .findBy('slug', projectSlug);
    if (preLoadedProject) {
      return preLoadedProject;
    } else {
      const orgSlug = params['organization'].organization_id;
      return yield this.get('store').findRecord('project', `${orgSlug}/${projectSlug}`);
    }
  }),
});
