import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {hash} from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const project = this.modelFor('organization.project');
    const organization = this.modelFor('organization');
    const projects = this.store.query('project', {organization: organization});
    const browserFamilies = this.get('store').findAll('browserFamily');

    return hash({organization, project, projects, browserFamilies});
  },

  actions: {
    projectUpdated(project) {
      // If project slug changed, redirect to new URL slug:
      let projectSlug = project.get('slug');
      let organizationSlug = project.get('organization.slug');
      this.transitionTo('organization.project.index', organizationSlug, projectSlug);
    },

    removeProjectBrowserTargetForFamily(familyToRemove, project) {
      const projectBrowserTargetForFamily = project
        .get('projectBrowserTargets')
        .find(function(pbt) {
          return pbt.get('browserTarget.browserFamily.id') === familyToRemove.get('id');
        });

      projectBrowserTargetForFamily.destroyRecord();
      this._callAnalytics('Remove Browser Family', {
        browser_family_slug: familyToRemove.get('slug'),
      });
    },

    addProjectBrowserTargetForFamily(familyToAdd, project) {
      const newProjectBrowserTarget = this.get('store').createRecord('projectBrowserTarget', {
        project,
        browserFamily: familyToAdd,
      });
      newProjectBrowserTarget.save();
      this._callAnalytics('Add Browser Family', {browser_family_slug: familyToAdd.get('slug')});
    },
  },

  _callAnalytics(actionName, extraProps) {
    const organization = this.get('project.organization');
    const props = {
      project_id: this.get('project.id'),
    };
    const allProps = Object.assign({}, extraProps, props);
    this.get('analytics').track(actionName, organization, allProps);
  },
});
