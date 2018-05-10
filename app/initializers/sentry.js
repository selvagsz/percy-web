import config from 'percy-web/config/environment';
import {default as Raven} from 'raven-js';

export function initialize(/* application */) {
  Raven.config(config.APP.SENTRY_URL, {
    release: config.APP.VERSION,
    ignoreErrors: ['TransitionAborted'],
  })
    .addPlugin(Raven.Plugins.Ember)
    .install();
}

export default {
  name: 'sentry',
  initialize,
};
