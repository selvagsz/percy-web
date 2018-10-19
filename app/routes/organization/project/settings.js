import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import {hash} from 'rsvp';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  flashMessages: service(),
  intercom: service(),
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

      projectBrowserTargetForFamily
        .destroyRecord()
        .then(() => {
          this.get('flashMessages').success(`All builds for this project going forward will not be run with ${familyToRemove.get('name')}.`, {title: 'Oh Well.'}); // eslint-disable-line
        })
        .catch(() => {
          this.get('flashMessages').danger('Something went wrong. Please try again later');
        });
      this._callAnalytics('Browser Family Removed', {
        browser_family_slug: familyToRemove.get('slug'),
      });
    },

    addProjectBrowserTargetForFamily(familyToAdd, project) {
      const newProjectBrowserTarget = this.get('store').createRecord('projectBrowserTarget', {
        project,
        browserFamily: familyToAdd,
      });
      newProjectBrowserTarget
        .save()
        .then(() => {
          this.get('flashMessages').success(`Great! All builds for this project going forward will be run with ${familyToAdd.get('name')}.`); // eslint-disable-line
        })
        .catch(() => {
          this.get('flashMessages').danger('Something went wrong. Please try again later');
        });
      this._callAnalytics('Browser Family Added', {browser_family_slug: familyToAdd.get('slug')});
    },

    showSupport() {
      this.get('intercom').showIntercom();
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
