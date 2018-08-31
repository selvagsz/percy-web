import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

import {
  GITHUB_INTEGRATION_TYPE,
  GITHUB_ENTERPRISE_INTEGRATION_TYPE,
  GITLAB_INTEGRATION_TYPE,
  GITLAB_SELF_HOSTED_INTEGRATION_TYPE,
} from 'percy-web/models/version-control-integration';

FactoryGuy.define('version-control-integration', {
  default: {},
  traits: {
    github: {
      githubInstallationId: () => faker.random.number(),
      integrationType: GITHUB_INTEGRATION_TYPE,
    },
    githubEnterprise: {
      githubEnterpriseInstallationId: () => faker.random.number(),
      githubEnterpriseIntegrationId: () => faker.random.number(),
      integrationType: GITHUB_ENTERPRISE_INTEGRATION_TYPE,
    },
    gitlab: {
      gitlabIntegrationId: () => faker.random.number(),
      isGitlabPersonalAccessTokenPresent: true,
      integrationType: GITLAB_INTEGRATION_TYPE,
    },
    // Simulate an unsaved record type
    newGitlab: {
      gitlabIntegrationId: () => faker.random.number(),
      isGitlabPersonalAccessTokenPresent: false,
      integrationType: GITLAB_INTEGRATION_TYPE,
    },
    gitlabSelfHosted: {
      gitlabHost: () => faker.internet.domainName(),
      isGitlabPersonalAccessTokenPresent: true,
      integrationType: GITLAB_SELF_HOSTED_INTEGRATION_TYPE,
    },
    // Simulate an unsaved record type
    newGitlabSelfHosted: {
      gitlabHost: () => faker.internet.domainName(),
      isGitlabPersonalAccessTokenPresent: false,
      integrationType: GITLAB_SELF_HOSTED_INTEGRATION_TYPE,
    },
  },
});
