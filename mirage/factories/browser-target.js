import {Factory, association, trait} from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  browserFamily: association(),
  versionTarget: faker.random.number,

  withChromeBrowserFamily: trait({
    browserFamily: association('chrome'),
  }),
  withFirefoxBrowserFamily: trait({
    browserFamily: association('firefox'),
  }),
});
