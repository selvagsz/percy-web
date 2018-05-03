import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('version-control-integration', {
  default: {},
  traits: {
    github: {
      githubInstallationId: () => faker.random.number(),
      integrationType: 'github',
    },
    githubEnterprise: {
      githubEnterpriseInstallationId: () => faker.random.number(),
      githubEnterpriseIntegrationId: () => faker.random.number(),
      integrationType: 'github_enterprise',
    },
    gitlab: {
      gitlabIntegrationId: () => faker.random.number(),
      integrationType: 'gitlab',
    },
  },
});
