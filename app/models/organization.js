import {computed} from '@ember/object';
import {filterBy, alias, bool, or, mapBy, uniq} from '@ember/object/computed';
import DS from 'ember-data';

const DISPLAY_NAMES = {
  github: 'GitHub',
  githubEnterprise: 'GitHub Enterprise',
};

export default DS.Model.extend({
  name: DS.attr(),
  slug: DS.attr(),
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

  isGithubIntegrated: computed('githubAuthMechanism', function() {
    return this.get('githubAuthMechanism') !== 'no-access';
  }),
  isGithubEnterpriseIntegrated: bool('githubEnterpriseIntegration'),
  isGitlabIntegrated: bool('gitlabIntegration'),
  isVersionControlIntegrated: or(
    'isGithubEnterpriseIntegrated',
    'isGithubIntegrated',
    'isGitlabIntegrated',
  ),

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
