import config from 'percy-web/config/environment';
import RavenLogger from 'ember-cli-sentry/services/raven';

export default RavenLogger.extend({
  ignoreErrors: [
    'TransitionAborted',
    "'XMLHttpRequest': Failed to load 'https://events.launchdarkly.com",
  ],
  release: config.APP.VERSION,
});
