import {clickable, create, collection, isVisible, text} from 'ember-cli-page-object';
// eslint-disable-next-line max-len
import {SELECTORS as IntegrationItemSelectors} from 'percy-web/tests/pages/components/integration-item';
// import {alias} from 'ember-cli-page-object/macros';

const SELECTORS = {
  ALL_INTEGRATION_ITEMS: '[data-test-all-integrations]',
  INTEGRATION_ITEMS: '[data-test-integration-item]',
  GITLAB_INTEGRATION: '[data-test-integration-name="gitlab"]',
  GITLAB_SELF_HOSTED_INTEGRATION: '[data-test-integration-name="gitlab-self-hosted"]',
};

export const IntegrationsIndexPage = {
  scope: SELECTORS.ALL_INTEGRATION_ITEMS,

  integrationItems: collection({
    itemScope: SELECTORS.INTEGRATION_ITEMS,
    item: {
      isGitlabIntegration: isVisible(SELECTORS.GITLAB_INTEGRATION),
      isGitlabSelfHostedIntegration: isVisible(SELECTORS.GITLAB_SELF_HOSTED_INTEGRATION),
      install: clickable(IntegrationItemSelectors.INSTALL_BUTTON),
      edit: clickable(IntegrationItemSelectors.EDIT_BUTTON),
      integrationName: text(IntegrationItemSelectors.INTEGRATION_NAME),
      hasInstallButton: isVisible(IntegrationItemSelectors.INSTALL_BUTTON),
      hasEditButton: isVisible(IntegrationItemSelectors.EDIT_BUTTON),
      hasContactButton: isVisible(IntegrationItemSelectors.CONTACT_BUTTON),
      hasBetaBadge: isVisible(IntegrationItemSelectors.BETA_BADGE),
    },
  }),

  gitlabIntegration: {
    isDescriptor: true,
    get() {
      return this.integrationItems()
        .toArray()
        .findBy('isGitlabIntegration');
    },
  },

  gitlabSelfHostedIntegration: {
    isDescriptor: true,
    get() {
      return this.integrationItems()
        .toArray()
        .findBy('isGitlabSelfHostedIntegration');
    },
  },
};

export default create(IntegrationsIndexPage);
