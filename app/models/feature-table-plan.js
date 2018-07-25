import Contentful from 'ember-data-contentful/models/contentful';
import attr from 'ember-data/attr';

export default Contentful.extend({
  contentType: 'featureTablePlan',

  name: attr('string'),
  unlimitedProjects: attr(),
  users: attr(),
  monthlySnapshotsIncluded: attr(),
  extraSnapshotPrice: attr(),
  historicalData: attr(),

  snapshotStabilization: attr(),
  responsiveTesting: attr(),
  crossBrowserSupport: attr(),
  evergreen: attr(),
  concurrentRenderers: attr(),

  github: attr(),
  gitlab: attr(),
  githubEnterprise: attr(),
  gitlabEnterprise: attr(),
  bitbucket: attr(),
  webhooks: attr(),
  slackIntegration: attr(),

  emailSupport: attr(),
  dedicatedSupport: attr(),
  sla: attr(),
  serviceAgreement: attr(),
  billingOptions: attr(),
});
