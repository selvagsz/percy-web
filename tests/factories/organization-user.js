import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('organization-user', {
  default: {
    user: FactoryGuy.belongsTo('user'),
    organization: FactoryGuy.belongsTo('organization'),
    role: 'member',
  },
  traits: {
    adminUser: {
      role: 'admin',
    },
  },
});
