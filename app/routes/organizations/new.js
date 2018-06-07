import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    githubMarketplacePlanId: {as: 'marketplace_listing_plan_id', replace: true},
  },

  githubMarketplacePlanId: null,

  actions: {
    organizationCreated(organization) {
      this.transitionTo('organizations.organization.index', organization.get('slug'));
    },
  },
});
