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

  // Repo will be set if this project is linked to a repository.
  repo: DS.belongsTo('repo', {async: false}),
  isRepoConnected: bool('repo'),
  isGithubRepo: and('isRepoConnected', 'repo.isGithubRepo'),
  isGithubEnterpriseRepo: and('isRepoConnected', 'repo.isGithubEnterpriseRepo'),
  isGitlabRepo: and('isRepoConnected', 'repo.isGitlabRepo'),
  isGithubRepoFamily: and('isRepoConnected', 'repo.isGithubRepoFamily'),

  builds: DS.hasMany('build', {async: true}),
  tokens: DS.hasMany('token', {async: true}),
  webhookConfigs: DS.hasMany('webhookConfig', {async: true}),

  projectBrowserTargets: DS.hasMany('projectBrowserTargets', {async: false}),

  _lastBuild: computed('organization', 'slug', 'builds', function() {
    return this.store.query('build', {project: this, page: {limit: 1}});
  }),
  lastBuild: computed.alias('_lastBuild.lastObject'),

  writeOnlyToken: computed('tokens', function() {
    return this.get('tokens').findBy('role', 'write_only');
  }),
});
