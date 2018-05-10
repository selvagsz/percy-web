import {alias} from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  project: null,
  classes: null,

  isSaving: null,
  isSaveSuccessful: null,

  selectedRepo: alias('project.repo'),
  organization: alias('project.organization'),
  groupedRepos: alias('organization.groupedRepos'),

  triggerSavingIndicator(promise) {
    this.set('isSaveSuccessful', null);
    this.set('isSaving', true);
    promise.then(
      () => {
        this.set('isSaving', false);
        this.set('isSaveSuccessful', true);
      },
      () => {
        this.set('isSaveSuccessful', false);
      },
    );
  },

  classNames: ['ProjectsRepoIntegrator'],
  classNameBindings: ['classes'],
  actions: {
    chooseRepo(repo) {
      let project = this.get('project');
      project.set('repo', repo);

      // If the project is not saved (ie. we're on the new project screen), don't trigger saving,
      // just set the property above and it will be saved when the user creates the project.
      if (!project.get('isNew')) {
        this.triggerSavingIndicator(project.save());
      }
    },
  },
});
