import config from 'percy-web/config/environment';
import {Raven} from 'node_modules/raven-js/dist/ember/raven.js';

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
