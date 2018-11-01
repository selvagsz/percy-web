import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import BuildPage from 'percy-web/tests/pages/build-page';
import stubLockModal from 'percy-web/tests/helpers/stub-lock-modal';
import SnapshotViewerFull from 'percy-web/tests/pages/components/snapshot-viewer-full';
import ProjectPage from 'percy-web/tests/pages/project-page';
import {visit, currentRouteName} from '@ember/test-helpers';
import {percySnapshot} from 'ember-percy';

describe('Acceptance: Publicly viewable projects', function() {
  describe('when user is not logged in', function() {
    setupAcceptance({authenticate: false});

    let organization;
    let project;
    let build;

    setupSession(function(server) {
      stubLockModal(this.owner);
      this.loginUser = false;

      organization = server.create('organization');
      project = server.create('project', {organization});
      build = server.create('build', 'withSnapshots', {project: project});
    });

    it('shows build when project is returned from project request', async function() {
      await BuildPage.visitBuild({
        orgSlug: organization.slug,
        projectSlug: project.slug,
        buildId: build.id,
      });

      expect(currentRouteName()).to.equal('organization.project.builds.build.index');
      expect(
        BuildPage.snapshots(0).header.snapshotApprovalButton.isDisabled,
        'button should be disabled',
      ).to.equal(true);
      await percySnapshot(this.test);

      await BuildPage.snapshots(0).header.clickToggleFullscreen();
      expect(
        SnapshotViewerFull.header.snapshotApprovalButton.isDisabled,
        'fullscreen snapshot buttons should be disabled',
      ).to.equal(true);
    });

    it('shows placeholder when project is returned and there are no builds', async function() {
      const projectWithNoBuilds = server.create('project', {organization});
      await ProjectPage.visitProject({
        orgSlug: organization.slug,
        projectSlug: projectWithNoBuilds.slug,
      });

      expect(currentRouteName()).to.equal('organization.project.index');
      expect(ProjectPage.isNoBuildsPanelVisible).to.equal(true);
      await percySnapshot(this.test);
    });

    it.skip('redirects to login if no project is returned', async function() {
      // Imitate a 403 error when asking for this project/build by asking for a project/build
      // that doesn't exist
      await BuildPage.visitBuild({
        orgSlug: organization.slug,
        projectSlug: 'not-public-project',
        buildId: 'not-a-public-build',
      });

      expect(currentRouteName()).to.equal('login');
    });
  });

  describe('when user is logged in', function() {
    setupAcceptance();

    let userOrganization;
    let userProject;
    let userBuild;
    let otherOrganization;
    let project;
    let build;

    setupSession(function(server) {
      // current user will be set to the user for this org
      userOrganization = server.create('organization', 'withUser');
      userProject = server.create('project', {
        publiclyReadable: false,
        organization: userOrganization,
      });
      userBuild = server.create('build', 'withSnapshots', {project: userProject});

      // This other org exists that the current user will not have access to.
      otherOrganization = server.create('organization');
      project = server.create('project', {organization: otherOrganization});
      build = server.create('build', 'withSnapshots', {project: project});
    });

    describe('when a project is returned ', function() {
      describe("when user is member of project's org", function() {
        it('shows setup instructions when project has no builds', async function() {
          const projectWithNoBuilds = server.create('project', {organization: userOrganization});
          await ProjectPage.visitProject({
            orgSlug: userOrganization.slug,
            projectSlug: projectWithNoBuilds.slug,
          });

          expect(currentRouteName()).to.equal('organization.project.index');
          expect(ProjectPage.isNoBuildsPanelVisible).to.equal(false);
          await percySnapshot(this.test);
        });

        it('shows build correctly', async function() {
          await BuildPage.visitBuild({
            orgSlug: userOrganization.slug,
            projectSlug: userProject.slug,
            buildId: userBuild.id,
          });

          expect(currentRouteName()).to.equal('organization.project.builds.build.index');
          expect(
            BuildPage.snapshots(0).header.snapshotApprovalButton.isDisabled,
            'build page button should be enabled',
          ).to.equal(false);
          await percySnapshot(this.test);

          await BuildPage.snapshots(0).header.clickToggleFullscreen();
          expect(
            SnapshotViewerFull.header.snapshotApprovalButton.isDisabled,
            'full screen snapshot button should be enabled',
          ).to.equal(false);
        });
      });

      describe("when user is not a member of project's org", function() {
        it('shows placeholder when project has no builds', async function() {
          const projectWithNoBuilds = server.create('project', {organization: otherOrganization});
          await ProjectPage.visitProject({
            orgSlug: otherOrganization.slug,
            projectSlug: projectWithNoBuilds.slug,
          });

          expect(currentRouteName()).to.equal('organization.project.index');
          expect(ProjectPage.isNoBuildsPanelVisible).to.equal(true);
          await percySnapshot(this.test);
        });

        it('shows build correctly', async function() {
          await BuildPage.visitBuild({
            orgSlug: otherOrganization.slug,
            projectSlug: project.slug,
            buildId: build.id,
          });
          expect(currentRouteName()).to.equal('organization.project.builds.build.index');
          expect(
            BuildPage.snapshots(0).header.snapshotApprovalButton.isDisabled,
            'build screen buttons are disabled',
          ).to.equal(true);
          await percySnapshot(this.test);

          await BuildPage.snapshots(0).header.clickToggleFullscreen();
          expect(
            SnapshotViewerFull.header.snapshotApprovalButton.isDisabled,
            'fullscreen buttons are disabled',
          ).to.equal(true);
        });
      });
    });

    it('shows error page if project is not returned', async function() {
      await BuildPage.visitBuild({
        orgSlug: otherOrganization.slug,
        projectSlug: 'not-public-project',
        buildId: 123,
      });

      expect(currentRouteName()).to.equal('error');
      percySnapshot(this.test);
    });
  });
});

describe('Acceptance: Publicly viewable organizations', function() {
  describe('when a user is not logged in', function() {
    setupAcceptance({authenticate: false});

    let publicOrganization;

    setupSession(function(server) {
      stubLockModal(this.owner);
      this.loginUser = false;

      publicOrganization = server.create('organization');
      const project = server.create('project', {organization: publicOrganization});
      server.create('build', {project});
    });

    it('shows organization page with projects when org request returns an org', async function() {
      await visit(`/${publicOrganization.slug}`);
      expect(currentRouteName()).to.equal('organization.project.index');
      percySnapshot(this.test);
    });

    it('redirects to login when organization request returns an error', async function() {
      await visit('/org-that-api-will-not-disclose');
      expect(currentRouteName()).to.equal('login');
    });
  });

  describe('when a user is logged in', function() {
    setupAcceptance();

    let userOrganization;
    let userProject;

    setupSession(function(server) {
      // current user will be set to the user for this org
      userOrganization = server.create('organization', 'withUser');
      userProject = server.create('project', {
        organization: userOrganization,
      });
      server.create('build', 'withSnapshots', {project: userProject});
    });

    it('shows organization page when org request returns an org', async function() {
      await visit(`/${userOrganization.slug}`);
      expect(currentRouteName()).to.equal('organization.project.index');
      percySnapshot(this.test);
    });

    it('shows error page when org request returns an error', async function() {
      const badOrgSlug = 'org-that-api-will-not-disclose';
      await visit(`/${badOrgSlug}`);

      expect(currentRouteName()).to.equal('error');
      percySnapshot(this.test);
    });
  });
});
