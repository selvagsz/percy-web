import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('repo', {
  default: {
    name: () => faker.lorem.slug(20),
    htmlUrl: f => `https://${f.hostname}/org/repo`,
    slug: () => faker.lorem.slug(),
    source: 'none',
    hostname: '',
    isPrivate: false,
  },
  traits: {
    github: {
      source: 'github',
      hostname: 'github.com',
    },
    githubEnterprise: {
      source: 'github_enterprise',
      hostname: 'enterprise-host.com',
    },
    gitlab: {
      source: 'gitlab',
      hostname: 'gitlab.com',
    },
    gitlabSelfHosted: {
      source: 'gitlab_self_hosted',
      hostname: 'gitlab.example.com',
    },
    bitbucket: {
      source: 'bitbucket',
      hostname: 'bitbucket.com',
    },
  },
});
