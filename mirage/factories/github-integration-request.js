import {Factory, trait} from 'ember-cli-mirage';
import moment from 'moment';

export default Factory.extend({
  state: 'installable',

  createdAt() {
    return moment();
  },

  updatedAt() {
    return moment();
  },

  requested: trait({
    state: 'requested',
  }),
});
