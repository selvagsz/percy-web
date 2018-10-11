import {hash} from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';
import {inject as service} from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, ResetScrollMixin, {
  flashMessages: service(),

  model(params) {
    const organization = this.modelFor('organization');
    const project = this.modelFor('organization.project');
    const projects = this.store.query('project', {organization: organization});
    let webhookConfig;

    if (params.webhook_config_id == 'new') {
      webhookConfig = this.store.createRecord('webhookConfig', {
        project: project,
      });
    } else {
      webhookConfig = this.store.findRecord('webhookConfig', params.webhook_config_id);
    }

    return hash({organization, project, projects, webhookConfig});
  },

  actions: {
    webhookConfigUpdated() {
      this.get('flashMessages').success('u did it :) 🦄');
      window.scrollTo(0, 0);
    },
  },
});
