import Route from '@ember/routing/route';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';
import isUserMemberPromise from 'percy-web/lib/is-user-member-of-org';
import ExtendedInfinityModel from 'percy-web/lib/paginated-ember-infinity-model';
import {inject as service} from '@ember/service';
import {hash} from 'rsvp';

const BUILDS_PER_PAGE = 50;

export default Route.extend(ResetScrollMixin, {
  infinity: service(),

  model() {
    const project = this.modelFor('organization.project');
    const organization = this.modelFor('organization');
    const projects = this.store.query('project', {organization: organization});
    const sortedProjects = projects.then(projects => projects.sortBy('isDisabled', 'name'));
    const builds = this.infinity.model(
      'build',
      {
        project: project,
        perPage: BUILDS_PER_PAGE,
        perPageParam: 'page[limit]',
        pageParam: null,
        countParam: 'cursor',
      },
      ExtendedInfinityModel,
    );
    const isUserMemberOfOrg = isUserMemberPromise(organization);

    return hash({
      organization,
      project,
      sortedProjects,
      builds,
      isUserMemberOfOrg,
    });
  },

  actions: {
    didTransition() {
      this._super.apply(this, arguments);

      let project = this.modelFor(this.routeName).project;
      let organization = project.get('organization');
      let eventProperties = {
        project_id: project.get('id'),
        project_slug: project.get('slug'),
      };
      this.analytics.track('Project Viewed', organization, eventProperties);

      // If transitioning back to this page after first load, background reload the builds.
      if (project.get('builds').isFulfilled) {
        project.get('builds').reload();
      }
    },
  },
});
