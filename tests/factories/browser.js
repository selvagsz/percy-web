import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('browser', {
  default: {
    // Make this always the same by default so all the default models can pretend
    // they have the same browser
    id: 'firefox-id',
    version: '123.123',
    browserFamily: FactoryGuy.belongsTo('browser-family'),
  },
  traits: {
    chrome: {
      id: 'chrome-id',
      browserFamily: FactoryGuy.belongsTo('browser-family', 'chrome'),
    },
    olderChrome: {
      id: 'chrome-id-old',
      browserFamily: FactoryGuy.belongsTo('browser-family', 'chrome'),
      version: '0.99',
    },
    olderFirefox: {
      id: 'firefox-id-old',
      browserFamily: FactoryGuy.belongsTo('browser-family'),
      version: '0.99',
    },
  },
});
