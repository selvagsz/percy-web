import {
  GITHUB_INTEGRATION_TYPE,
  GITHUB_ENTERPRISE_INTEGRATION_TYPE,
  GITLAB_INTEGRATION_TYPE,
  GITLAB_SELF_HOSTED_INTEGRATION_TYPE,
} from 'percy-web/models/version-control-integration';

export const INTEGRATION_TYPES = {
  [GITHUB_INTEGRATION_TYPE]: {
    textName: 'GitHub',
    isBeta: false,
    isGeneralAvailability: true,
    iconName: 'github-icon-lg',
    organizationModelAttribute: 'isGithubIntegrated',
    settingsRouteSlug: 'github',
  },
  [GITHUB_ENTERPRISE_INTEGRATION_TYPE]: {
    textName: 'GitHub Enterprise',
    isBeta: true,
    isGeneralAvailability: false,
    betaLink: 'https://docs.percy.io/docs/github-enterprise',
    iconName: 'github-icon-lg',
    organizationModelAttribute: 'isGithubEnterpriseIntegrated',
    settingsRouteSlug: 'github-enterprise',
  },
  [GITLAB_INTEGRATION_TYPE]: {
    textName: 'GitLab',
    isBeta: false,
    isGeneralAvailability: true,
    betaLink: 'https://docs.percy.io/docs/gitlab',
    iconName: 'gitlab-icon-lg',
    organizationModelAttribute: 'isGitlabIntegrated',
    settingsRouteSlug: 'gitlab',
  },
  [GITLAB_SELF_HOSTED_INTEGRATION_TYPE]: {
    textName: 'GitLab Self-Hosted',
    isBeta: true,
    isGeneralAvailability: true,
    betaLink: 'https://docs.percy.io/docs/gitlab-self-hosted',
    iconName: 'gitlab-icon-lg',
    organizationModelAttribute: 'isGitlabSelfHostedIntegrated',
    settingsRouteSlug: 'gitlab-self-hosted',
  },
};
