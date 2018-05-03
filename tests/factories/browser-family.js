import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('browser-family', {
  sequences: {
    id: i => i,
  },
  default: {
    name: 'Firefox',
    slug: 'firefox',
  },
  traits: {
    chrome: {
      name: 'Chrome',
      slug: 'chrome',
    },
  },
});
