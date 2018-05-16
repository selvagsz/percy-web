import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('browser', {
  default: {
    // Make this always the same number by default so all the default models can pretend
    // they have the same browser
    id: 1,
    version: '123.123',
    browserFamily: () => {
      return FactoryGuy.make('browser-family');
    },
  },
  traits: {
    chrome: {
      browserFamily: () => {
        return FactoryGuy.make('browser-family', 'chrome');
      },
    },
  },
});
