import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('repo', {
  default: {
    name: () => faker.lorem.slug(20),
    htmlUrl: () => faker.internet.url(),
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
  },
});
