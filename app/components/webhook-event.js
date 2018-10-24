import Component from '@ember/component';
import {computed} from '@ember/object';

const FAILURE_MESSAGES = {
  timeout:
    'Webhook delivery failed because the remote server took too long ' +
    'to respond. Ensure that your server responds to webhook requests within ' +
    '10 seconds to guarantee webhook delivery.',

  ssl_verification_failed:
    'Webhook delivery failed because we were unable ' +
    "to verify the remote server's SSL certificate. Ensure that your server " +
    'presents a current, valid SSL certificate, or disable SSL verification ' +
    'in your configuration.',

  unknown_host:
    'Webhook delivery failed because the remote host could not ' +
    'be found. Ensure that your configuration is correct, and that the ' +
    'external service is reachable.',

  too_many_redirects:
    'Webhook delivery failed because the remote server ' +
    'redirected the webhook request too many times. Ensure that your server ' +
    'redirects no more than 3 times to guarantee webhook delivery.',

  unknown:
    'Webhook delivery failed because of an unknown error. Please ' +
    'contact support if this issue persists.',
};

export default Component.extend({
  isOpen: false,

  isRequest: true,

  failureMessage: computed('webhookEvent.failureReason', function() {
    return FAILURE_MESSAGES[this.get('webhookEvent.failureReason')];
  }),

  actions: {
    toggleOpen: function() {
      this.set('isOpen', !this.get('isOpen'));
    },

    openTab: function(tab) {
      this.set('isRequest', tab === 'request');
    },
  },
});
