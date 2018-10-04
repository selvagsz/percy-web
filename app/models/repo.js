import {computed} from '@ember/object';
import {equal, or} from '@ember/object/computed';
import DS from 'ember-data';
import {
  GITHUB_INTEGRATION_TYPE,
  GITHUB_ENTERPRISE_INTEGRATION_TYPE,
  GITLAB_INTEGRATION_TYPE,
  GITLAB_SELF_HOSTED_INTEGRATION_TYPE,
} from 'percy-web/models/version-control-integration';

export default DS.Model.extend({
  externalRepoId: DS.attr('number'),
  name: DS.attr(),
  slug: DS.attr(),
  hostname: DS.attr(),
  source: DS.attr(),
  htmlUrl: DS.attr(),
  isPrivate: DS.attr('boolean'),
  description: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  isGithubRepo: equal('source', GITHUB_INTEGRATION_TYPE),
  isGithubEnterpriseRepo: equal('source', GITHUB_ENTERPRISE_INTEGRATION_TYPE),
  isGithubRepoFamily: or('isGithubRepo', 'isGithubEnterpriseRepo'),
  isGitlabRepo: equal('source', GITLAB_INTEGRATION_TYPE),
  isGitlabSelfHostedRepo: equal('source', GITLAB_SELF_HOSTED_INTEGRATION_TYPE),
  branchUrlFragment: computed('source', function() {
    let source = this.get('source');
    if (source === 'bitbucket') {
      return 'src';
    } else {
      return 'tree';
    }
  }),
  commitUrlFragment: computed('source', function() {
    let source = this.get('source');
    if (source === 'bitbucket') {
      return 'commits';
    } else {
      return 'commit';
    }
  }),
});
