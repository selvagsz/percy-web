import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('browser', {
  default: {
    // Make this always the same by default so all the default models can pretend
    // they have the same browser
    id: 'firefox-id',
    version: '123.123',
    browserFamily: () => {
      return FactoryGuy.make('browser-family');
    },
  },
  traits: {
    chrome: {
      id: 'chrome-id',
      browserFamily: () => {
        return FactoryGuy.make('browser-family', 'chrome');
      },
    },
  },
});
