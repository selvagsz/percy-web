import Component from '@ember/component';
import {lookup} from 'percy-web/lib/computed/objectLookup';
import {computed} from '@ember/object';

import {
  GITHUB_INTEGRATION_TYPE,
  GITHUB_ENTERPRISE_INTEGRATION_TYPE,
  GITLAB_INTEGRATION_TYPE,
} from 'percy-web/models/version-control-integration';

const INTEGRATIONS_LOOKUP = {
  [GITHUB_INTEGRATION_TYPE]: {
    textName: 'GitHub',
    isBeta: false,
    iconName: 'github-icon-lg',
    organizationModelAttribute: 'isGithubIntegrated',
    settingsRouteSlug: 'github',
  },
  [GITHUB_ENTERPRISE_INTEGRATION_TYPE]: {
    textName: 'GitHub Enterprise',
    isBeta: true,
    betaLink: 'https://docs.percy.io/docs/github-enterprise',
    iconName: 'github-icon-lg',
    organizationModelAttribute: 'isGithubEnterpriseIntegrated',
    settingsRouteSlug: 'github-enterprise',
  },
  [GITLAB_INTEGRATION_TYPE]: {
    textName: 'GitLab',
    isBeta: true,
    betaLink: 'https://docs.percy.io/docs/gitlab',
    iconName: 'gitlab-icon-lg',
    organizationModelAttribute: 'isGitlabIntegrated',
    settingsRouteSlug: 'gitlab',
  },
};

export default Component.extend({
  tagName: '',
  integrationName: null, // required

  orgSlug: computed.readOnly('organization.slug'),

  textName: lookup('integrationName', INTEGRATIONS_LOOKUP, 'textName'),
  isBeta: lookup('integrationName', INTEGRATIONS_LOOKUP, 'isBeta'),
  routeSlug: lookup('integrationName', INTEGRATIONS_LOOKUP, 'settingsRouteSlug'),
  iconName: lookup('integrationName', INTEGRATIONS_LOOKUP, 'iconName'),
  betaLink: lookup('integrationName', INTEGRATIONS_LOOKUP, 'betaLink'),

  isGHEnterprise: computed.equal('integrationName', GITHUB_ENTERPRISE_INTEGRATION_TYPE),

  hasBetaBadge: computed('isBeta', function() {
    return this.get('isBeta') && !this.get('isGHEnterprise') ? true : false;
  }),

  organizationModelAttribute: lookup(
    'integrationName',
    INTEGRATIONS_LOOKUP,
    'organizationModelAttribute',
  ),

  isInstalled: computed('integrationName', function() {
    return this.get(`organization.${this.get('organizationModelAttribute')}`);
  }),

  integrationSettingsRoute: computed('integrationName', function() {
    return `organizations.organization.integrations.${this.get('routeSlug')}`;
  }),

  buttonText: computed('isInstalled', function() {
    return this.get('isInstalled') ? 'Edit Settings' : 'Install';
  }),

  buttonClasses: computed('isInstalled', function() {
    return this.get('isInstalled')
      ? 'btn data-test-integration-button-edit'
      : 'btn data-test-integration-button-install btn-primary btn-shadow-purple';
  }),

  actions: {
    openIntercom() {
      const messageText =
        "Hi! I'd like to edit the details of our " + `${this.get('textName')} integration.`;

      window.Intercom('showNewMessage', messageText);
    },
  },
});
