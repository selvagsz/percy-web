import config from 'percy-web/config/environment';
import RavenLogger from 'ember-cli-sentry/services/raven';

export default RavenLogger.extend({
  ignoreErrors: ['TransitionAborted'],
  release: config.APP.VERSION,
});
