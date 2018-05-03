import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';
import {makeList} from 'ember-data-factory-guy';

FactoryGuy.define('organization', {
  default: {
    name: () => faker.company.companyName(),
    slug: f => faker.helpers.slugify(f.name),

    projects: FactoryGuy.hasMany('project'),
    versionControlIntegrations: FactoryGuy.hasMany('version-control-integration'),
    repos: FactoryGuy.hasMany('repo'),
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
    withMultipleIntegrations: {
      versionControlIntegrations: () => {
        return makeList('version-control-integration', 'github', 'githubEnterprise');
      },
      repos: () => {
        return makeList('repo', 'github', ['githubEnterprise', {hostname: 'foo.com'}]);
      },
    },
    withRepos: {repos: () => makeList('repo', 3)},
    withGithubRepos: {repos: () => makeList('repo', 3, 'github')},
    withGithubEnterpriseRepos: {repos: () => makeList('repo', 3, 'githubEnterprise')},
    withProjects: {projects: () => makeList('project', 5)},
  },
});
