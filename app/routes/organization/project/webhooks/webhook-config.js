import {hash} from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';

export default Route.extend(AuthenticatedRouteMixin, ResetScrollMixin, {
  model(params) {
    const webhookConfig = this.store.findRecord('webhookConfig', params.webhook_config_id);
    const project = this.modelFor('organization.project');
    const organization = this.modelFor('organization');
    const projects = this.store.query('project', {organization: organization});

    return hash({organization, project, projects, webhookConfig});
  },
});
