import Component from '@ember/component';
import {computed} from '@ember/object';
import {alias} from '@ember/object/computed';

export default Component.extend({
  build: null,
  commit: null,
  isRepoLinked: alias('build.isRepoLinked'),
  commitUrl: computed('build.repo', 'commit.sha', function() {
    let repoUrl = this.get('build.repo.htmlUrl');
    let commitUrlFragment = this.get('build.repo.commitUrlFragment');
    let commitSha = this.get('commit.sha');
    return `${repoUrl}/${commitUrlFragment}/${commitSha}`;
  }),
  branchUrl: computed('build.repo', 'commit.sha', function() {
    let repoUrl = this.get('build.repo.htmlUrl');
    let branchUrlFragment = this.get('build.repo.branchUrlFragment');
    let buildBranch = this.get('build.branch');
    return `${repoUrl}/${branchUrlFragment}/${buildBranch}`;
  }),
});
