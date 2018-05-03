import {Factory, trait, association} from 'ember-cli-mirage';

export default Factory.extend({
  id(i) {
    return `${i}`;
  },

  version: 'abc.123',
  browserFamily: association(),

  chrome: trait({
    slug: 'chrome',
    name: 'Chrome',
  }),
});
