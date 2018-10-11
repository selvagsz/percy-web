import {computed} from '@ember/object';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  newGitlabIntegration: computed('currentIntegration', function() {
    // This computed property relies on currentIntegration, because the current integration can
    // change between routes, therefore requiring to recompute the property
    return this.store.createRecord('version-control-integration', {
      integrationType: this.get('currentIntegrationType'),
      organization: this.modelFor(this.routeName),
    });
  }),
  model() {
    let organization = this.modelFor('organizations.organization');
    this.set('currentOrganization', organization);
    return organization;
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      organization: model,
      currentGitlabIntegration: this.get('currentGitlabIntegration'),
    });
  },
  actions: {
    redirectToIntegrationsIndex() {
      this.transitionTo('organizations.organization.integrations.index');
    },
    willTransition() {
      let model = this.store.peekAll('version-control-integration').findBy('isNew', true);
      if (model) {
        this.store.unloadRecord(model);
      }
    },
    didTransition() {
      this._super.apply(this, arguments);

      let organization = this.modelFor(this.routeName);
      let friendlyName = this.get('currentGitlabIntegration.friendlyName');
      if (friendlyName) {
        this.analytics.track(`Integrations ${friendlyName} Viewed`, organization);
      }
      return true;
    },
  },
});
