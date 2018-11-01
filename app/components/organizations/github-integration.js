import {alias} from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  organization: null,
  classes: null,

  currentIntegration: alias('organization.githubIntegration'),

  actions: {
    cancelIntegrationRequest() {
      if (this.get('cancelIntegrationRequest')) {
        this.get('cancelIntegrationRequest')();
      }
    },
  },
});
