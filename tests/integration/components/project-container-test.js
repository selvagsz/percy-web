import {setupRenderingTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make, makeList} from 'ember-data-factory-guy';
import ProjectContainer from 'percy-web/tests/pages/components/project-container';
import sinon from 'sinon';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {merge} from '@ember/polyfills';

const INFINITY_MODEL_STUB = {
  reachedInfinity: true,
  on: () => {},
  off: () => {},
};

describe('Integration: ProjectContainer', function() {
  setupRenderingTest('project-container', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    ProjectContainer.setContext(this);
  });

  describe('without a repo', function() {
    beforeEach(async function() {
      const project = make('project');
      const builds = makeList('build', 1, {buildNumber: 1});
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows no logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(project.get('isRepoConnected')).to.equal(false);
      expect(ProjectContainer.repoLinked.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
      expect(ProjectContainer.repoLinked.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with an empty repo source', function() {
    beforeEach(async function() {
      const project = make('project', 'withRepo');
      const builds = makeList('build', 1, 'withRepo', 'hasPullRequest', {buildNumber: 1});
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows no logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(project.get('isRepoConnected')).to.equal(true);
      expect(project.get('isGithubRepo')).to.equal(false);
      expect(project.get('isGithubEnterpriseRepo')).to.equal(false);
      expect(project.get('isGithubRepoFamily')).to.equal(false);
      expect(project.get('isGitlabRepo')).to.equal(false);
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(ProjectContainer.repoLinked.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
      expect(ProjectContainer.repoLinked.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with a github repo', function() {
    beforeEach(async function() {
      const project = make('project', 'withGithubRepo');
      const builds = makeList('build', 1, 'withGithubRepo', 'hasPullRequest', {buildNumber: 1});
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows the github logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(project.get('isRepoConnected')).to.equal(true);
      expect(project.get('isGithubRepo')).to.equal(true);
      expect(project.get('isGithubEnterpriseRepo')).to.equal(false);
      expect(project.get('isGithubRepoFamily')).to.equal(true);
      expect(project.get('isGitlabRepo')).to.equal(false);
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(ProjectContainer.repoLinked.githubLogo.isVisible, 'github logo is visible').to.equal(
        true,
      );
      expect(
        ProjectContainer.repoLinked.gitlabLogo.isVisible,
        'gitlab logo is not visible',
      ).to.equal(false);
    });
  });

  describe('with a github enterprise repo', function() {
    beforeEach(async function() {
      const project = make('project', 'withGithubEnterpriseRepo');
      const builds = makeList('build', 1, 'withGithubEnterpriseRepo', 'hasPullRequest', {
        buildNumber: 1,
      });
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows the github logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(project.get('isRepoConnected')).to.equal(true);
      expect(project.get('isGithubRepo')).to.equal(false);
      expect(project.get('isGithubEnterpriseRepo')).to.equal(true);
      expect(project.get('isGithubRepoFamily')).to.equal(true);
      expect(project.get('isGitlabRepo')).to.equal(false);
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(
        ProjectContainer.repoLinked.githubLogo.isVisible,
        'github logo is not visible',
      ).to.equal(true);
      expect(ProjectContainer.repoLinked.gitlabLogo.isVisible, 'gitlab logo is visible').to.equal(
        false,
      );
    });
  });

  describe('with a gitlab repo', function() {
    beforeEach(async function() {
      const project = make('project', 'withGitlabRepo');
      const builds = makeList('build', 1, 'withGitlabRepo', 'hasPullRequest', {buildNumber: 1});
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const isSidebarVisible = false;
      const toggleSidebar = sinon.stub();
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub, isSidebarVisible, toggleSidebar});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        isSidebarVisible=isSidebarVisible
        toggleSidebar=toggleSidebar
        isUserMember=true
      }}`);
    });

    it('shows the gitlab logo', async function() {
      await percySnapshot(this.test.fullTitle());
      const project = this.get('project');
      expect(project.get('isRepoConnected')).to.equal(true);
      expect(project.get('isGithubRepo')).to.equal(false);
      expect(project.get('isGithubEnterpriseRepo')).to.equal(false);
      expect(project.get('isGithubRepoFamily')).to.equal(false);
      expect(project.get('isGitlabRepo')).to.equal(true);
      expect(ProjectContainer.builds().count).to.equal(1);
      expect(
        ProjectContainer.repoLinked.gitlabLogo.isVisible,
        'gitlab logo is not visible',
      ).to.equal(true);
      expect(ProjectContainer.repoLinked.githubLogo.isVisible, 'github logo is visible').to.equal(
        false,
      );
    });
  });

  describe('when user is not member of org', function() {
    beforeEach(async function() {
      const project = make('project', 'withGithubRepo');
      const builds = makeList('build', 1);
      const infinityBuilds = merge(builds, INFINITY_MODEL_STUB);
      const stub = sinon.stub();
      this.setProperties({project, infinityBuilds, stub});

      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        toggleSidebar=stub
        isUserMember=false
      }}`);
    });

    it('displays notice that build is public', async function() {
      expect(ProjectContainer.isPublicProjectNoticeVisible).to.equal(true);
      await percySnapshot(this.test);
    });
  });

  describe('when a project is public', function() {
    beforeEach(function() {
      const project = make('project', 'public');
      const stub = sinon.stub();
      this.setProperties({
        project,
        stub,
      });
    });

    it('shows public globe icon in header', async function() {
      await this.render(hbs`{{project-container
        project=project
        builds=infinityBuilds
        infinityBuilds=infinityBuilds
        pollRefresh=stub
        toggleSidebar=stub
      }}`);

      expect(ProjectContainer.isPublicProjectIconVisible).to.equal(true);
    });
  });
});
