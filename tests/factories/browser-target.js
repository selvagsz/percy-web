import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('browser-target', {
  default: {
    browserFamily: FactoryGuy.belongsTo('browser-target'),
    versionTarget: faker.random.number,
  },
});
