import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import config from 'percy-web/config/environment';
import PollingMixin from 'percy-web/mixins/polling';

export default Component.extend(PollingMixin, {
  organization: null,
  classes: null,

  store: service(),

  currentIntegration: alias('organization.githubIntegration'),
  githubIntegrationUrl: config.APP.githubUrls.integration,

  shouldPollForUpdates: alias('organization.githubIntegrationRequest'),
  pollRefresh() {
    this.get('organization')
      .reload()
      .then(organization => {
        let githubIntegration = organization.get('githubIntegration');
        let githubIntegrationRequest = organization.get('githubIntegrationRequest');

        // If the has been fully installed or uninstalled, stop polling for updates.
        if (githubIntegration || (!githubIntegration && !githubIntegrationRequest)) {
          this.get('pollingTask').cancel();
        }
      });
  },

  classNames: ['OrganizationsGithubIntegrator'],
  classNameBindings: ['classes'],
  attributeBindings: ['data-test-ogranizations-github-integrator'],
  'data-test-ogranizations-github-integrator': true,
  actions: {
    cancelIntegrationRequest() {
      let integrationRequest = this.get('organization.githubIntegrationRequest');
      integrationRequest.set('_orgForAdapter', this.get('organization'));
      integrationRequest.destroyRecord();
      this.get('pollingTask').cancel();
    },
    triggerInstallation() {
      let url = this.get('githubIntegrationUrl');
      let organization = this.get('organization');
      let githubIntegrationRequest = this.get('store').createRecord('github-integration-request', {
        _orgForAdapter: organization,
      });
      githubIntegrationRequest.save().then(() => {
        window.location.href = url;
        return;
      });
    },
    showSupport() {
      this.sendAction('showSupport');
    },
  },
});
