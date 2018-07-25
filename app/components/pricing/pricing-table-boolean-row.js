import Component from '@ember/component';
import {computed} from '@ember/object';
import {readOnly} from '@ember/object/computed';

export default Component.extend({
  tagName: 'tr',

  startupPlans: readOnly('plans.startupPlans'),
  anyStartupPlanIsTrue: computed('startupPlans', function() {
    return this.get('startupPlans').any(plan => {
      return plan.get(this.get('field')) || plan.get(this.get('field')) === 'true';
    });
  }),
});
