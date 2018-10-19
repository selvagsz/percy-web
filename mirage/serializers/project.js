import {JSONAPISerializer} from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: [
    'organization',
    'repo',
    'browserTargets',
    'browserTargets.browserFamily',
    'projectBrowserTargets',
    'projectBrowserTargets.project',
    'projectBrowserTargets.browserTarget',
    'webhookConfigs',
  ],
  links(project) {
    return {
      tokens: {
        related: `/api/v1/projects/${project.fullSlug}/tokens`,
      },
      builds: {
        related: `/api/v1/projects/${project.fullSlug}/builds`,
      },
    };
  },
});
