import {Factory, trait, association} from 'ember-cli-mirage';

export default Factory.extend({
  // Make this always the same number by default so all the default models can pretend
  // they have the same browser
  id: 1,

  version: 'abc.123',
  browserFamily: association(),

  chrome: trait({
    familySlug: 'chrome',
    familyName: 'Chrome',
  }),
});
