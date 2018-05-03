import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('browser', {
  sequences: {
    id: i => i,
  },
  default: {
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
