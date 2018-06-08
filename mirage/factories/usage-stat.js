import moment from 'moment';
import {Factory} from 'ember-cli-mirage';

export default Factory.extend({
  total: 500,
  dayStats() {
    return [
      [moment('2020-01-15').toJSON(), 5000],
      [moment('2020-01-16').toJSON(), 100],
      [moment('2020-01-17').toJSON(), 500],
      [moment('2020-01-18').toJSON(), 450],
      [moment('2020-01-19').toJSON(), 0],
      [moment('2020-01-20').toJSON(), 20],
      [moment('2020-01-21').toJSON(), 0],
      [moment('2020-01-22').toJSON(), 0],
      [moment('2020-01-23').toJSON(), 0],
      [moment('2020-01-24').toJSON(), 0],
      [moment('2020-01-25').toJSON(), 0],
      [moment('2020-01-26').toJSON(), 0],
      [moment('2020-01-27').toJSON(), 0],
      [moment('2020-01-28').toJSON(), 50],
      [moment('2020-01-29').toJSON(), 50],
      [moment('2020-01-30').toJSON(), 50],
      [moment('2020-01-31').toJSON(), 20],
      [moment('2020-02-01').toJSON(), 50],
      [moment('2020-02-02').toJSON(), 50],
      [moment('2020-02-03').toJSON(), 50],
      [moment('2020-02-04').toJSON(), 0],
      [moment('2020-02-05').toJSON(), 0],
      [moment('2020-02-06').toJSON(), 0],
      [moment('2020-02-07').toJSON(), 0],
      [moment('2020-02-08').toJSON(), 0],
      [moment('2020-02-09').toJSON(), 0],
      [moment('2020-02-10').toJSON(), 0],
      [moment('2020-02-11').toJSON(), 0],
      [moment('2020-02-12').toJSON(), 0],
      [moment('2020-02-13').toJSON(), 0],
      [moment('2020-02-14').toJSON(), 0],
    ];
  },
});
