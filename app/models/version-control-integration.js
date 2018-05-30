import {equal} from '@ember/object/computed';
import DS from 'ember-data';

// these strings must match what comes down from the api
export const GITHUB_ENTERPRISE_INTEGRATION_TYPE = 'github_enterprise';
export const GITHUB_INTEGRATION_TYPE = 'github';
export const GITLAB_INTEGRATION_TYPE = 'gitlab';

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
  gitlabBotUserId: DS.attr(),

  isSyncing: DS.attr(),
  lastUpdatedAt: DS.attr(),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  isGithubIntegration: equal('integrationType', GITHUB_INTEGRATION_TYPE),
  isGithubEnterpriseIntegration: equal('integrationType', GITHUB_ENTERPRISE_INTEGRATION_TYPE),
  isGitlabIntegration: equal('integrationType', GITLAB_INTEGRATION_TYPE),
});
