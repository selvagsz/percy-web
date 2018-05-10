/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      comments: false,
    },
    'ember-cli-babel': {
      includePolyfill: true,
    },
    'ember-cli-mocha': {
      useLintTree: false,
    },
    sassOptions: {
      extension: 'scss',
      sourceMapEmbed: true,
    },
    autoprefixer: {
      browsers: ['last 2 versions'],
      sourcemap: true,
    },
    fingerprint: {
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg'],
      prepend: '/static/',
    },
    svg: {
      paths: ['public/images/icons', 'public/images/logos'],
      optimize: false,
    },
    sourcemaps: {
      enabled: true,
    },
  });

  app.import('node_modules/accounting/accounting.js');
  app.import('node_modules/highlightjs/styles/github.css');
  app.import('node_modules/highlightjs/highlight.pack.js');
  app.import('node_modules/hint.css/hint.css');
  app.import('node_modules/raven-js/dist/ember/raven.js', {
    exports: {
      Raven: ['default'],
    },
  });
  app.import('node_modules/raven-js/plugins/ember.js');
  app.import('node_modules/sinon-chai/lib/sinon-chai.js', {type: 'test'});
  app.import('node_modules/seedrandom/seedrandom.js');

  var extraAssets;
  if (app.env === 'development' || app.env === 'test') {
    extraAssets = new Funnel('tests/public/images/test', {
      destDir: 'images/test',
    });
  }
  return app.toTree(extraAssets);
};
