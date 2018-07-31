import DS from 'ember-data';
import {computed} from '@ember/object';
import moment from 'moment';

export default DS.Model.extend({
  total: DS.attr(),
  dayStats: DS.attr(),
  currentCost: DS.attr(),

  dayStatsFormatted: computed('dayStats', function() {
    const dayStats = this.get('dayStats');
    if (!dayStats) {
      return;
    }

    return dayStats.map(dayStat => [moment(dayStat[0]), dayStat[1]]);
  }),

  // Everything in the API is in cents, but we need to display dollars, so divide by 100.
  currentCostDollars: computed('currentCost', function() {
    return this.get('currentCost') / 100;
  }),
});
