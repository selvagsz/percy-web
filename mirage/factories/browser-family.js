import {Factory, trait} from 'ember-cli-mirage';

export default Factory.extend({
  name: 'Firefox',
  slug: 'firefox',
  id: '1',

  chrome: trait({
    name: 'Chrome',
    slug: 'chrome',
    id: '2',
  }),

  firefox: trait({
    name: 'Firefox',
    slug: 'firefox',
    id: '1',
  }),
});
