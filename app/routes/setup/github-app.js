import {alias} from '@ember/object/computed';
import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  session: service(),
  flashMessages: service(),
  currentUser: alias('session.currentUser'),

  queryParams: {
    installationId: {
      as: 'installation_id',
    },
  },

  installationId: null,

  actions: {
    afterAppInstalled(organization) {
      organization.get('projects').then(projects => {
        if (projects.get('length') > 0) {
          this.replaceWith('organizations.organization.integrations', organization.get('slug'));
        } else {
          this.replaceWith('organization.index', organization.get('slug'));
        }
      });
    },
  },

  model(params) {
    this.set('installationId', params.installationId);
  },
});
