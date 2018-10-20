import {Factory} from 'ember-cli-mirage';

export default Factory.extend({
  url(i) {
    return `https://example.com/${i}`;
  },
  subscribedEvents: ['ping'],
  authToken: 'secret',
});
