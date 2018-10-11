import {equal} from '@ember/object/computed';
import DS from 'ember-data';
import {computed} from '@ember/object';
import {
  GITHUB_INTEGRATION_TYPE,
  GITHUB_ENTERPRISE_INTEGRATION_TYPE,
  GITLAB_INTEGRATION_TYPE,
  GITLAB_SELF_HOSTED_INTEGRATION_TYPE,
  INTEGRATION_TYPES,
} from 'percy-web/lib/integration-types';

export default DS.Model.extend({
  organization: DS.belongsTo('organization'),
  gitLabBotUser: DS.belongsTo('user'),
  githubInstallationId: DS.attr(),
  githubAccountAvatarUrl: DS.attr(),
  githubHtmlUrl: DS.attr(),
  integrationType: DS.attr(),
  githubEnterpriseHost: DS.attr(),
  githubEnterpriseInstallationId: DS.attr(),
  githubEnterpriseIntegrationId: DS.attr(),
  gitlabIntegrationId: DS.attr(),
  gitlabHost: DS.attr(),
  gitlabPersonalAccessToken: DS.attr(),
  isGitlabPersonalAccessTokenPresent: DS.attr('boolean'),
  status: DS.attr(),

  isSyncing: DS.attr(),
  lastUpdatedAt: DS.attr(),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  isGithubIntegration: equal('integrationType', GITHUB_INTEGRATION_TYPE),
  isGithubEnterpriseIntegration: equal('integrationType', GITHUB_ENTERPRISE_INTEGRATION_TYPE),
  isGitlabIntegration: equal('integrationType', GITLAB_INTEGRATION_TYPE),
  isGitlabSelfHostedIntegration: equal('integrationType', GITLAB_SELF_HOSTED_INTEGRATION_TYPE),
  friendlyName: computed('integrationType', function() {
    let integrationType = this.get('integrationType');
    if (integrationType) {
      let integrationItem = INTEGRATION_TYPES[integrationType];
      if (integrationItem) {
        return integrationItem['textName'];
      }
    }
  }),
});
