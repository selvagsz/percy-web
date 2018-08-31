import {or} from '@ember/object/computed';
import GitlabCommon from 'percy-web/routes/organizations/organization/integrations/gitlab-common';
import {GITLAB_INTEGRATION_TYPE} from 'percy-web/models/version-control-integration';

export default GitlabCommon.extend({
  currentIntegrationType: GITLAB_INTEGRATION_TYPE,
  currentGitlabIntegration: or('currentOrganization.gitlabIntegration', 'newGitlabIntegration'),
});
