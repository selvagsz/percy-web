import {Factory, trait} from 'ember-cli-mirage';

export default Factory.extend({
  id: 'free',
  name: 'Free plan',
  interval: 'month',
  intervalCount: 1,
  workerLimit: 2,
  usageIncluded: 500,
  historyLimitDays: 7,
  isTrial: false,
  isFree: true,

  trial: trait({
    id: 'trial',
    name: 'Test plan (trial)',
    workerLimit: 8,
    usageIncluded: 12000,
    historyLimitDays: 90,
    allowOverages: true,
    overageUnitCost: 0.01,
    isTrial: true,
    isFree: false,
  }),

  standard: trait({
    id: 'v2-small',
    name: 'Small plan',
    workerLimit: 8,
    usageIncluded: 12000,
    historyLimitDays: 90,
    allowOverages: true,
    overageUnitCost: 0.01,
    isTrial: false,
    isFree: false,
  }),

  custom: trait({
    id: 'custom',
    name: 'Custom plan',
    workerLimit: 1000,
    usageIncluded: 10000000,
    historyLimitDays: 900,
    allowOverages: true,
    overageUnitCost: 0.01,
    isTrial: false,
    isFree: false,
  }),
});
