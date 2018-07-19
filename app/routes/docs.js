import Route from '@ember/routing/route';
import utils from 'percy-web/lib/utils';
import {Promise} from 'rsvp';

const REDIRECTS = {
  '/docs': '/docs',
  // CI services
  '/docs/setup/travis-ci': '/docs/travis-ci',
  '/docs/setup/circleci': '/docs/circleci',
  '/docs/setup/semaphore': '/docs/semaphore',
  '/docs/setup/codeship': '/docs/codeship',
  '/docs/setup/buildkite': '/docs/buildkite',
  '/docs/setup/drone': '/docs/drone',
  '/docs/setup/jenkins': '/docs/jenkins',
  '/docs/setup/local': '/docs/local-development',
  // Languages
  // JS
  '/docs/clients/javascript/ember': '/docs/ember',
  '/docs/clients/javascript/storybook-for-angular': '/docs/storybook-for-angular',
  '/docs/clients/javascript/react-storybook': '/docs/storybook-for-react',
  '/docs/clients/javascript/storybook-for-vue': '/docs/storybook-for-vue',
  '/docs/clients/javascript/webdriverio': '/docs/webdriverio',
  // Ruby
  '/docs/clients/ruby/capybara-rails': '/docs/rails',
  '/docs/clients/ruby/capybara-other': '/docs/ruby-other',
  '/docs/clients/ruby/percy-anywhere': '/docs/percy-anywhere',
  '/docs/clients/ruby/best-practices': '/docs/ruby-best-practices',
  // Python
  '/docs/clients/python/selenium': '/docs/python-selenium',
  // Static sites
  '/docs/clients/ruby/cli': '/docs/command-line-client',
  // Integrations
  '/docs/integrations/github': '/docs/github',
  '/docs/integrations/github-enterprise': '/docs/github-enterprise',
  '/docs/integrations/gitlab': '/docs/gitlab',
  '/docs/integrations/bitbucket': '/docs/bitbucket',
  // Tutorials
  '/docs/tutorials/example-apps': '/docs/example-apps',
  '/docs/tutorials/ember': '/docs/ember-tutorial',
  '/docs/tutorials/rails': '/docs/rails-tutorial',
  '/docs/tutorials/storybook-for-react': '/docs/storybook-tutorial',
  // Learn
  '/docs/learn/cross-browser-visual-testing': '/docs/cross-browser-visual-testing',
  '/docs/learn/responsive': '/docs/responsive-visual-diffs',
  '/docs/learn/animations': '/docs/animations',
  '/docs/learn/percy-specific-css': '/docs/percy-specific-css',
  '/docs/learn/fonts': '/docs/font-services',
  '/docs/learn/baseline-picking-logic': '/docs/baseline-picking-logic',
  '/docs/learn/parallel-tests': '/docs/parallel-test-suites',
  '/docs/learn/env-vars': '/docs/environment-variables',
  '/docs/learn/faq': '/docs/faq',
  // Reference
  '/docs/api/ruby-client': '/docs/ruby-api-client',
  '/docs/api/javascript-client': '/docs/javascript-api-client',
  '/docs/api/reference': '/docs/reference',
};

export default Route.extend({
  beforeModel(transition) {
    // If the target route contains anything related to the old docs, don't continue.
    // This returns a promise because beforeModel blocks on a returned promise.
    // If a promise is not returned, it starts the transition but continues loading the app
    // causing visual jank.
    // The promise does not resolve, as we do not want the app to proceed further
    // if we are redirecting
    return new Promise(() => {
      const targetPage = transition.intent.url;
      if (targetPage in REDIRECTS) {
        return utils.setWindowLocation(`https://docs.percy.io${REDIRECTS[targetPage]}`);
      } else {
        return utils.setWindowLocation('https://docs.percy.io');
      }
    });
  },
});
