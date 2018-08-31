import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';
import {makeList} from 'ember-data-factory-guy';
import moment from 'moment';

FactoryGuy.define('organization', {
  default: {
    name: () => faker.company.companyName(),
    slug: f => faker.helpers.slugify(f.name),

    projects: FactoryGuy.hasMany('project'),
    versionControlIntegrations: FactoryGuy.hasMany('version-control-integration'),
    repos: FactoryGuy.hasMany('repo'),
    organizationUsers: FactoryGuy.hasMany('organization-user'),
    lastSyncedAt: () => {
      return moment().subtract(11, 'minutes');
    },
    isSyncing: () => {
      return false;
    },
  },
  traits: {
    withGithubIntegration: {
      versionControlIntegrations: () => {
        return makeList('version-control-integration', ['github']);
      },
      repos: () => {
        return makeList('repo', 2, 'github');
      },
    },
    withGithubEnterpriseIntegration: {
      versionControlIntegrations: () => {
        return makeList('version-control-integration', ['githubEnterprise']);
      },
      repos: () => {
        return makeList('repo', 2, 'githubEnterprise');
      },
    },
    withGitlabIntegration: {
      versionControlIntegrations: () => {
        return makeList('version-control-integration', ['gitlab']);
      },
      repos: () => {
        return makeList('repo', 2, 'gitlab');
      },
    },
    withNewGitlabIntegration: {
      versionControlIntegrations: () => {
        return makeList('version-control-integration', ['newGitlab']);
      },
    },
    withGitlabSelfHostedIntegration: {
      versionControlIntegrations: () => {
        return makeList('version-control-integration', ['gitlabSelfHosted']);
      },
      repos: () => {
        return makeList('repo', 2, 'gitlabSelfHosted');
      },
    },
    withNewGitlabSelfHostedIntegration: {
      versionControlIntegrations: () => {
        return makeList('version-control-integration', ['newGitlabSelfHosted']);
      },
    },
    withMultipleIntegrations: {
      versionControlIntegrations: () => {
        return makeList(
          'version-control-integration',
          'github',
          'gitlab',
          'gitlabSelfHosted',
          'githubEnterprise',
        );
      },
      repos: () => {
        return makeList('repo', 'github', 'gitlab', 'gitlabSelfHosted', [
          'githubEnterprise',
          {hostname: 'foo.com'},
        ]);
      },
    },
    withStaleRepoData: {
      lastSyncedAt: () => {
        return moment().subtract(20, 'minutes');
      },
      isSyncing: () => {
        return false;
      },
    },
    withFreshRepoData: {
      lastSyncedAt: () => {
        return moment().subtract(1, 'minute');
      },
      isSyncing: () => {
        return false;
      },
    },
    withRepos: {repos: () => makeList('repo', 3)},
    withGithubRepos: {repos: () => makeList('repo', 3, 'github')},
    withGitlabRepos: {repos: () => makeList('repo', 3, 'gitlab')},
    withGitlabSelfHostedRepos: {repos: () => makeList('repo', 3, 'gitlabSelfHosted')},
    withGithubEnterpriseRepos: {repos: () => makeList('repo', 3, 'githubEnterprise')},
    withProjects: {projects: () => makeList('project', 5)},
  },
});
