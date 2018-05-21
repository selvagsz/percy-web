import {Factory, trait, association} from 'ember-cli-mirage';

export default Factory.extend({
  // Make this always the same by default so all the default models can pretend
  // they have the same browser
  id: 'firefox-id',

  version: 'abc.123',
  browserFamily: association(),

  chrome: trait({
    id: 'chrome-id',
    afterCreate(browser, server) {
      const browserFamily = server.create('browserFamily', 'chrome');
      browser.update({browserFamily});
    },
  }),
});
