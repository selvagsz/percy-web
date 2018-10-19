import {computed} from '@ember/object';
import {alias} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  organization: null,
  currentGitlabIntegration: null,

  store: service(),
  session: service(),
  intercom: service(),

  currentUser: alias('session.currentUser'),
  isNewRecord: computed('currentGitlabIntegration.dirtyType', function() {
    let record = this.get('currentGitlabIntegration');
    if (record) {
      return record.get('dirtyType') === 'created';
    }
  }),

  actions: {
    showSupport() {
      const messageText =
        "Hi! I'd like to run GitLab Self-Managed behind a firewall." +
        ' Do you have information for me on how to get started?';

      this.get('intercom').showIntercom('showNewMessage', messageText);
    },
  },
});
