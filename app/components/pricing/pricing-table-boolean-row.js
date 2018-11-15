import Component from '@ember/component';
import {computed} from '@ember/object';
import {readOnly} from '@ember/object/computed';

export default Component.extend({
  tagName: 'tr',
  field: null,

  _firstStartupPlan: readOnly('plans.startupPlans.firstObject'),
  _businessPlan: readOnly('plans.businessPlan'),
  _enterprisePlan: readOnly('plans.enterprisePlan'),

  isStartupPlansTruthy: computed('_firstStartupPlan', function() {
    return this._isTruthy('_firstStartupPlan');
  }),

  isBusinessPlanTruthy: computed('_businessPlan', function() {
    return this._isTruthy('_businessPlan');
  }),

  isEnterprisePlanTruthy: computed('_enterprisePlan', function() {
    return this._isTruthy('_enterprisePlan');
  }),

  _isTruthy(plan) {
    const field = this.get('field');
    const value = this.get(plan).get(field);
    return value === 'true' || value === true;
  },
});
