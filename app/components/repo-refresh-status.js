import Component from '@ember/component';

export default Component.extend({
  classNames: ['ProjectsRepoIntegratorRefreshStatus'],
  attributeBindings: ['data-test-repo-refresh-status'],
  'data-test-repo-refresh-status': true,
});
