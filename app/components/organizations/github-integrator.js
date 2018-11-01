import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import config from 'percy-web/config/environment';
import PollingMixin from 'percy-web/mixins/polling';

export default Component.extend(PollingMixin, {
  store: service(),

  githubIntegrationUrl: config.APP.githubUrls.integration,
  organization: null,
  classes: null,

  currentIntegration: alias('organization.githubIntegration'),
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
  },
});
