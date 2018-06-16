import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';
import {makeList} from 'ember-data-factory-guy';
import {resolve} from 'rsvp';

FactoryGuy.define('user', {
  default: {
    name: () => `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: () => faker.internet.email(),
    avatarUrl: () => faker.internet.avatar(),
    userHash: () => faker.random.number(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),

    organizations: FactoryGuy.hasMany('organization'),
  },
  traits: {
    withOrganizations: {
      organizations: () => {
        return makeList('organization', 5);
      },
    },

    withGithubIdentity: {
      hasGithubIdentity: () => {
        return resolve(true);
      },
    },
  },
});
