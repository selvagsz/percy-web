import {JSONAPISerializer} from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: [
    'subscription',
    'versionControlIntegrations',
    'subscription.currentUsageStats',
    'githubIntegrationRequest',
    'githubIntegrationRequest.createdBy',
  ],
  links(organization) {
    return {
      projects: {
        related: `/api/v1/organizations/${organization.slug}/projects`,
      },
      organizationUsers: {
        related: `/api/v1/organizations/${organization.slug}/organization-users`,
      },
    };
  },
});
