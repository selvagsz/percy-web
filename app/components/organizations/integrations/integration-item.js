import Component from '@ember/component';
import {lookup} from 'percy-web/lib/computed/objectLookup';
import {computed} from '@ember/object';
import {equal} from '@ember/object/computed';
import AdminMode from 'percy-web/lib/admin-mode';

import {GITHUB_ENTERPRISE_INTEGRATION_TYPE} from 'percy-web/lib/integration-types';

import {INTEGRATION_TYPES as INTEGRATIONS_LOOKUP} from 'percy-web/lib/integration-types';

export default Component.extend({
  tagName: '',
  integrationName: null, // required
  integrationStatus: null,

  orgSlug: computed.readOnly('organization.slug'),

  textName: lookup('integrationName', INTEGRATIONS_LOOKUP, 'textName'),
  isBeta: lookup('integrationName', INTEGRATIONS_LOOKUP, 'isBeta'),
  routeSlug: lookup('integrationName', INTEGRATIONS_LOOKUP, 'settingsRouteSlug'),
  iconName: lookup('integrationName', INTEGRATIONS_LOOKUP, 'iconName'),
  betaLink: lookup('integrationName', INTEGRATIONS_LOOKUP, 'betaLink'),
  isGeneralAvailability: lookup('integrationName', INTEGRATIONS_LOOKUP, 'isGeneralAvailability'),
  isIntegrationDisabled: equal('integrationStatus', 'unauthorized'),

  isGHEnterprise: equal('integrationName', GITHUB_ENTERPRISE_INTEGRATION_TYPE),

  hasBetaBadge: computed('isBeta', function() {
    return this.get('isBeta') && !this.get('isGHEnterprise') ? true : false;
  }),

  organizationModelAttribute: lookup(
    'integrationName',
    INTEGRATIONS_LOOKUP,
    'organizationModelAttribute',
  ),

  integrationItems: INTEGRATIONS_LOOKUP,

  isEnabled: computed('integrationName', function() {
    let isGeneralAvailability = this.get('isGeneralAvailability');
    let isAdminModeEnabled = AdminMode.isAdmin();
    if (isAdminModeEnabled || isGeneralAvailability) {
      return true;
    } else {
      return false;
    }
  }),

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
      ? 'data-test-integration-button-edit btn'
      : 'data-test-integration-button-install btn btn-primary shadow-purple-lg m-0';
  }),

  actions: {
    openIntercom() {
      const messageText =
        "Hi! I'd like to edit the details of our " + `${this.get('textName')} integration.`;

      window.Intercom('showNewMessage', messageText);
    },
  },
});
