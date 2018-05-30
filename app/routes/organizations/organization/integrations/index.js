import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import {
  GITHUB_INTEGRATION_TYPE,
  GITHUB_ENTERPRISE_INTEGRATION_TYPE,
  GITLAB_INTEGRATION_TYPE,
} from 'percy-web/models/version-control-integration';

export default Route.extend(AuthenticatedRouteMixin, {
  setupController(controller, model) {
    this._super(controller, model);

    controller.setProperties({
      githubIntegrationName: GITHUB_INTEGRATION_TYPE,
      githubEnterpriseIntegrationName: GITHUB_ENTERPRISE_INTEGRATION_TYPE,
      gitlabIntegrationName: GITLAB_INTEGRATION_TYPE,
    });
  },
});
