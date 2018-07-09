import {Factory, trait} from 'ember-cli-mirage';

export default Factory.extend({
  github: trait({
    afterCreate(integration) {
      integration.update({
        integrationType: 'github',
        githubInstallationId: `${integration.id}`,
      });
    },
  }),
  gitlab: trait({
    afterCreate(integration) {
      integration.update({
        integrationType: 'gitlab',
        gitlabIntegrationId: `${integration.id}`,
      });
    },
  }),
  personalAccessToken: trait({
    afterCreate(integration) {
      integration.update({
        gitlabBotUserId: 1,
        isGitlabPersonalAccessTokenPresent: true,
      });
    },
  }),
});
