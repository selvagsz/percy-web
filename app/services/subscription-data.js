import Service from '@ember/service';

export default Service.extend({
  PLAN_IDS: ['free', 'v2-small', 'v2-medium', 'v2-large', 'v2-enterprise'],
  PLANS: [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      numDiffs: 500,
      numTeamMembersTitle: '1 team member',
      numWorkersTitle: '2 concurrent renderers',
      numUsersTitle: 'Unlimited users',
      historyLimitTitle: '7 day history',
    },
    {
      id: 'v2-small',
      name: 'Small',
      monthlyPrice: 149,
      numDiffs: 10000,
      extraDiffPrice: 0.01,
      numTeamMembersTitle: '5 team members',
      numWorkersTitle: '8 concurrent renderers',
      historyLimitTitle: '30 day history',
    },
    {
      id: 'v2-medium',
      name: 'Medium',
      monthlyPrice: 399,
      numDiffs: 50000,
      extraDiffPrice: 0.008,
      numTeamMembersTitle: '10 team members',
      numWorkersTitle: '16 concurrent renderers',
      historyLimitTitle: '90 day history',
    },
    {
      id: 'v2-large',
      name: 'Large',
      monthlyPrice: 849,
      numDiffs: 200000,
      extraDiffPrice: 0.006,
      numTeamMembersTitle: '20 team members',
      numWorkersTitle: '40 concurrent renderers',
      historyLimitTitle: '1 year history',
    },
  ],
});
