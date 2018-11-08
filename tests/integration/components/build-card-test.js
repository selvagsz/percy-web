import {setupRenderingTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import BuildCard from 'percy-web/tests/pages/components/build-card';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: BuildCard', function() {
  setupRenderingTest('build-card', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    BuildCard.setContext(this);
  });

  describe('with an empty repo source', function() {
    beforeEach(async function() {
      const build = make('build', 'withRepo', 'hasPullRequest', {buildNumber: 1});
      this.setProperties({build});

      await this.render(hbs`{{build-card
        build=build
      }}`);
    });

    it('has a pull request URL', function() {
      expect(
        BuildCard.commitDetails.pullRequestUrl.link,
        'pull request link is incorrect',
      ).to.equal('http://example.com/pull/123');
    });

    it('shows no logo', async function() {
      await percySnapshot(this.test.fullTitle());
      expect(BuildCard.sourceCodeMetadata.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
      expect(BuildCard.sourceCodeMetadata.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with a build with a long commit message', function() {
    beforeEach(async function() {
      const build = make('build', 'withGithubRepo', 'withLongHeadCommitMessage', {buildNumber: 1});
      this.setProperties({build});

      await this.render(hbs`{{build-card
        build=build
      }}`);
    });

    it('renders correctly', async function() {
      await percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a github repo', function() {
    beforeEach(async function() {
      const build = make('build', 'withGithubRepo', 'hasPullRequest', {buildNumber: 1});
      this.setProperties({build});

      await this.render(hbs`{{build-card
        build=build
      }}`);
    });

    it('has a pull request URL', function() {
      expect(
        BuildCard.commitDetails.pullRequestUrl.link,
        'pull request link is incorrect',
      ).to.equal('http://example.com/pull/123');
    });

    it('shows the github logo', async function() {
      await percySnapshot(this.test.fullTitle());
      expect(
        BuildCard.sourceCodeMetadata.githubLogo.isVisible,
        'github logo is not visible',
      ).to.equal(true);
      expect(BuildCard.sourceCodeMetadata.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with a github enterprise repo', function() {
    beforeEach(async function() {
      const build = make('build', 'withGithubEnterpriseRepo', 'hasPullRequest', {buildNumber: 1});

      this.setProperties({build});

      await this.render(hbs`{{build-card
        build=build
      }}`);
    });

    it('has a pull request URL', function() {
      expect(
        BuildCard.commitDetails.pullRequestUrl.link,
        'pull request link is incorrect',
      ).to.equal('http://example.com/pull/123');
    });

    it('shows the github logo', async function() {
      await percySnapshot(this.test.fullTitle());
      expect(
        BuildCard.sourceCodeMetadata.githubLogo.isVisible,
        'github logo is not visible',
      ).to.equal(true);
      expect(BuildCard.sourceCodeMetadata.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with a gitlab repo', function() {
    beforeEach(async function() {
      const build = make('build', 'withGitlabRepo', 'hasPullRequest', {buildNumber: 1});

      this.setProperties({build});

      await this.render(hbs`{{build-card
        build=build
      }}`);
    });

    it('has a pull request URL', function() {
      expect(
        BuildCard.commitDetails.pullRequestUrl.link,
        'pull request link is incorrect',
      ).to.equal('http://example.com/pull/123');
    });

    it('shows the gitlab logo', async function() {
      await percySnapshot(this.test.fullTitle());
      expect(
        BuildCard.sourceCodeMetadata.gitlabLogo.isVisible,
        'gitlab logo is not visible',
      ).to.equal(true);
      expect(BuildCard.sourceCodeMetadata.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with a gitlab self-hosted repo', function() {
    beforeEach(async function() {
      const build = make('build', 'withGitlabSelfHostedRepo', 'hasMergeRequest', {buildNumber: 1});
      this.setProperties({build});

      await this.render(hbs`{{build-card
        build=build
      }}`);
    });

    it('has a pull request URL', function() {
      expect(
        BuildCard.commitDetails.pullRequestUrl.link,
        'pull request link is incorrect',
      ).to.equal('http://example.com/merge_requests/123');
    });

    it('shows the gitlab logo', async function() {
      await percySnapshot(this.test.fullTitle());
      expect(
        BuildCard.sourceCodeMetadata.gitlabLogo.isVisible,
        'gitlab logo is not visible',
      ).to.equal(true);
      expect(BuildCard.sourceCodeMetadata.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
    });
  });
});
