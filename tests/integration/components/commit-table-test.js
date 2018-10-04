import {setupComponentTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import CommitTable from 'percy-web/tests/pages/components/commit-table';

describe('Integration: CommitTable', function() {
  setupComponentTest('commit-table', {
    integration: true,
  });

  describe('with a github integration', function() {
    let build;
    beforeEach(function() {
      setupFactoryGuy(this.container);
      CommitTable.setContext(this);

      build = make('build', 'withGithubRepo');
      this.setProperties({build});

      this.render(hbs`{{
        commit-table
        build=build
        commit=build.commit
      }}`);
    });

    it('has the correct commit URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let commitSha = build.get('commit.sha');
      expect(commitSha).to.equal('01cb4be6f5dc5a3d19d57bbf840328fd0eb3a01f');
      expect(htmlUrl).to.not.equal(undefined);
      expect(CommitTable.commitUrl.href).to.equal(`${htmlUrl}/commit/${commitSha}`);
    });

    it('has the correct commit SHA label', function() {
      let shortSha = build.get('commit.shaShort');
      expect(shortSha).to.equal('01cb4be');
      expect(CommitTable.commitUrl.text).to.equal(shortSha);
    });

    it('has the correct branch label', function() {
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.text).to.equal(branch);
    });

    it('has the correct branch URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.href).to.equal(`${htmlUrl}/tree/${branch}`);
    });
  });

  describe('with a github enterprise integration', function() {
    let build;
    beforeEach(function() {
      setupFactoryGuy(this.container);
      CommitTable.setContext(this);

      build = make('build', 'withGithubEnterpriseRepo');
      this.setProperties({build});

      this.render(hbs`{{
        commit-table
        build=build
        commit=build.commit
      }}`);
    });

    it('has the correct commit URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let commitSha = build.get('commit.sha');
      expect(commitSha).to.equal('01cb4be6f5dc5a3d19d57bbf840328fd0eb3a01f');
      expect(htmlUrl).to.not.equal(undefined);
      expect(CommitTable.commitUrl.href).to.equal(`${htmlUrl}/commit/${commitSha}`);
    });

    it('has the correct commit SHA label', function() {
      let shortSha = build.get('commit.shaShort');
      expect(shortSha).to.equal('01cb4be');
      expect(CommitTable.commitUrl.text).to.equal(shortSha);
    });

    it('has the correct branch label', function() {
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.text).to.equal(branch);
    });

    it('has the correct branch URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.href).to.equal(`${htmlUrl}/tree/${branch}`);
    });
  });

  describe('with a gitlab integration', function() {
    let build;
    beforeEach(function() {
      setupFactoryGuy(this.container);
      CommitTable.setContext(this);

      build = make('build', 'withGitlabRepo');
      this.setProperties({build});

      this.render(hbs`{{
        commit-table
        build=build
        commit=build.commit
      }}`);
    });

    it('has the correct commit URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let commitSha = build.get('commit.sha');
      expect(commitSha).to.equal('01cb4be6f5dc5a3d19d57bbf840328fd0eb3a01f');
      expect(htmlUrl).to.not.equal(undefined);
      expect(CommitTable.commitUrl.href).to.equal(`${htmlUrl}/commit/${commitSha}`);
    });

    it('has the correct commit SHA label', function() {
      let shortSha = build.get('commit.shaShort');
      expect(shortSha).to.equal('01cb4be');
      expect(CommitTable.commitUrl.text).to.equal(shortSha);
    });

    it('has the correct branch label', function() {
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.text).to.equal(branch);
    });

    it('has the correct branch URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.href).to.equal(`${htmlUrl}/tree/${branch}`);
    });
  });

  describe('with a gitlab self-hosted integration', function() {
    let build;
    beforeEach(function() {
      setupFactoryGuy(this.container);
      CommitTable.setContext(this);

      build = make('build', 'withGitlabSelfHostedRepo');
      this.setProperties({build});

      this.render(hbs`{{
        commit-table
        build=build
        commit=build.commit
      }}`);
    });

    it('has the correct commit URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let commitSha = build.get('commit.sha');
      expect(commitSha).to.equal('01cb4be6f5dc5a3d19d57bbf840328fd0eb3a01f');
      expect(htmlUrl).to.not.equal(undefined);
      expect(CommitTable.commitUrl.href).to.equal(`${htmlUrl}/commit/${commitSha}`);
    });

    it('has the correct commit SHA label', function() {
      let shortSha = build.get('commit.shaShort');
      expect(shortSha).to.equal('01cb4be');
      expect(CommitTable.commitUrl.text).to.equal(shortSha);
    });

    it('has the correct branch label', function() {
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.text).to.equal(branch);
    });

    it('has the correct branch URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.href).to.equal(`${htmlUrl}/tree/${branch}`);
    });
  });

  describe('with a bitbucket integration', function() {
    let build;
    beforeEach(function() {
      setupFactoryGuy(this.container);
      CommitTable.setContext(this);

      build = make('build', 'withBitbucketRepo');
      this.setProperties({build});

      this.render(hbs`{{
        commit-table
        build=build
        commit=build.commit
      }}`);
    });

    it('has the correct commit URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let commitSha = build.get('commit.sha');
      expect(commitSha).to.equal('01cb4be6f5dc5a3d19d57bbf840328fd0eb3a01f');
      expect(htmlUrl).to.not.equal(undefined);
      expect(CommitTable.commitUrl.href).to.equal(`${htmlUrl}/commits/${commitSha}`);
    });

    it('has the correct commit SHA label', function() {
      let shortSha = build.get('commit.shaShort');
      expect(shortSha).to.equal('01cb4be');
      expect(CommitTable.commitUrl.text).to.equal(shortSha);
    });

    it('has the correct branch label', function() {
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.text).to.equal(branch);
    });

    it('has the correct branch URL', function() {
      let htmlUrl = build.get('repo.htmlUrl');
      let branch = build.get('branch');
      expect(branch).to.equal('master');
      expect(CommitTable.branchUrl.href).to.equal(`${htmlUrl}/src/${branch}`);
    });
  });
});
