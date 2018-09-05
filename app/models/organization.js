import {computed} from '@ember/object';
import {filterBy, alias, bool, mapBy, uniq} from '@ember/object/computed';
import DS from 'ember-data';
import {INTEGRATION_TYPES} from 'percy-web/lib/integration-types';

const DISPLAY_NAMES = {
  github: 'GitHub',
  githubEnterprise: 'GitHub Enterprise',
  gitlab: 'GitLab',
  gitlabSelfHosted: 'GitLab Self-Hosted',
};

export default DS.Model.extend({
  name: DS.attr(),
  slug: DS.attr(),
  isSyncing: DS.attr(),
  lastSyncedAt: DS.attr(),
  versionControlIntegrations: DS.hasMany('version-control-integrations', {
    async: false,
  }),

  githubIntegration: computed('versionControlIntegrations.@each.githubIntegrationId', function() {
    return this.get('versionControlIntegrations').findBy('isGithubIntegration');
  }),

  githubEnterpriseIntegration: computed(
    'versionControlIntegrations.@each.githubEnterpriseIntegrationId',
    function() {
      return this.get('versionControlIntegrations').findBy('githubEnterpriseIntegrationId');
    },
  ),

  gitlabIntegration: computed('versionControlIntegrations.@each.gitlabIntegrationId', function() {
    return this.get('versionControlIntegrations').findBy('gitlabIntegrationId');
  }),

  gitlabSelfHostedIntegration: computed('versionControlIntegrations.@each.gitlabHost', function() {
    return this.get('versionControlIntegrations').findBy('gitlabHost');
  }),

  githubIntegrationRequest: DS.belongsTo('github-integration-request', {
    async: false,
  }),
  subscription: DS.belongsTo('subscription', {async: false}),
  projects: DS.hasMany('project'),
  billingProvider: DS.attr(),
  billingProviderData: DS.attr(),
  billingLocked: DS.attr('boolean'),

  // Filtered down to saved projects, does not include unsaved project objects:
  savedProjects: filterBy('projects', 'isNew', false),

  organizationUsers: DS.hasMany('organization-user'),

  // These are GitHub repositories that the organization has access permissions to. These are not
  // useful on their own other than for listing. A repo must be linked to a project.
  repos: DS.hasMany('repo'),

  isGithubIntegrated: bool('githubIntegration'),
  isGithubEnterpriseIntegrated: bool('githubEnterpriseIntegration'),
  isGitlabIntegrated: bool('gitlabIntegration'),
  isGitlabSelfHostedIntegrated: bool('gitlabSelfHostedIntegration'),
  isVersionControlIntegrated: bool('versionControlIntegrations.length'),

  availableIntegrations: computed('versionControlIntegrations.[]', function() {
    let integrations = [];
    for (const key of Object.keys(INTEGRATION_TYPES)) {
      let item = INTEGRATION_TYPES[key];
      if (this.get(`${item.organizationModelAttribute}`) != true) {
        integrations.push(key);
      }
    }
    return integrations;
  }),

  githubAuthMechanism: computed('githubIntegration', function() {
    if (this.get('githubIntegration')) {
      return 'github-integration';
    }
    return 'no-access';
  }),

  // A funky, but efficient, way to query the API for only the current user's membership.
  // Use `organization.currentUserMembership` to get the current user's OrganizationUser object.
  currentUserMembership: alias('_filteredOrganizationUsers.firstObject'),
  _filteredOrganizationUsers: computed(function() {
    return this.store.query('organization-user', {
      organization: this,
      filter: 'current-user-only',
    });
  }),

  githubRepos: filterBy('repos', 'source', 'github'),
  githubEnterpriseRepos: filterBy('repos', 'source', 'github_enterprise'),
  gitlabRepos: filterBy('repos', 'source', 'gitlab'),
  gitlabSelfHostedRepos: filterBy('repos', 'source', 'gitlab_self_hosted'),
  repoSources: mapBy('repos', 'source'),
  uniqueRepoSources: uniq('repoSources'),

  // Return repos grouped by source:
  // groupedRepos: [
  //   { groupName: 'GitHub', options: [repo:model, repo:model, ...] },
  //   { groupName: 'GitHub Enterprise', options: [repo:model, repo:model, ...] },
  // ]
  groupedRepos: computed(
    'githubRepos.[]',
    'githubEnterpriseRepos.[]',
    'gitlabRepos.[]',
    'gitlabSelfHostedRepos.[]',
    'uniqueRepoSources.[]',
    function() {
      const groups = [];
      this.get('uniqueRepoSources').forEach(source => {
        if (source) {
          const displayName = source.camelize();
          const reposForGroup = this.get(`${displayName}Repos`);
          if (reposForGroup) {
            groups.push({
              groupName: DISPLAY_NAMES[displayName],
              options: this.get(`${displayName}Repos`),
            });
          }
        }
      });
      return groups;
    },
  ),
});
