import {alias} from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  organization: null,
  classes: null,

  currentIntegration: alias('organization.githubIntegration'),
  classNames: ['OrganizationsGithubIntegration'],
  classNameBindings: ['classes'],
  attributeBindings: ['data-test-github-integration'],
  'data-test-github-integration': true,
  actions: {
    cancelIntegrationRequest() {
      this.sendAction('cancelIntegrationRequest');
    },
  },
});
