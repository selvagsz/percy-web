import {computed} from '@ember/object';
import {and, bool, not} from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  organization: DS.belongsTo('organization', {async: false}),
  name: DS.attr(),
  slug: DS.attr(),
  fullSlug: DS.attr(),
  isEnabled: DS.attr('boolean'),
  isDisabled: not('isEnabled'),
  diffBase: DS.attr(), // Either "automatic" or "manual".
  autoApproveBranchFilter: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  publiclyReadable: DS.attr('boolean'),

  // Repo will be set if this project is linked to a repository.
  repo: DS.belongsTo('repo', {async: false}),
  isRepoConnected: bool('repo'),
  isGithubRepo: and('isRepoConnected', 'repo.isGithubRepo'),
  isGithubEnterpriseRepo: and('isRepoConnected', 'repo.isGithubEnterpriseRepo'),
  isGitlabRepo: and('isRepoConnected', 'repo.isGitlabRepo'),
  isGithubRepoFamily: and('isRepoConnected', 'repo.isGithubRepoFamily'),

  builds: DS.hasMany('build', {async: true}),
  tokens: DS.hasMany('token', {async: true}),
  webhookConfigs: DS.hasMany('webhookConfig', {async: false}),

  projectBrowserTargets: DS.hasMany('projectBrowserTargets', {async: false}),

  writeOnlyToken: computed('tokens', function() {
    return this.get('tokens').findBy('role', 'write_only');
  }),
});
