import {afterEach, beforeEach} from 'mocha';
import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import freezeMoment from '../helpers/freeze-moment';
import moment from 'moment';
import ProjectPage from 'percy-web/tests/pages/project-page';
import adminMode from 'percy-web/lib/admin-mode';

describe('Acceptance: Project', function() {
  setupAcceptance();

  describe('organization has no projects', function() {
    setupSession(function(server) {
      this.organization = server.create('organization', 'withUser');
    });

    it('can create', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentPath()).to.equal('organization.index');
      await percySnapshot(this.test.fullTitle() + ' | index');

      await click('a:contains("Create your first project")');
      expect(currentPath()).to.equal('organizations.organization.projects.new');

      await percySnapshot(this.test.fullTitle() + ' | new project');
    });
  });

  describe('waiting for first snapshot', function() {
    setupSession(function(server) {
      let organization = server.create('organization', 'withUser');
      let project = server.create('project', {
        name: 'My Project Name',
        organization,
      });
      server.create('token', {project});
      this.project = project;
    });

    it('shows environment variables and demo project instructions', async function() {
      await visit(`/${this.project.fullSlug}`);
      expect(currentPath()).to.equal('organization.project.index');

      await percySnapshot(this.test);
      await click('a:contains("Demo Project Instructions")');
      await percySnapshot(this.test.fullTitle() + ' | demo project instructions are visible');
    });
  });

  describe('settings', function() {
    let organization;
    let versionControlIntegration;
    let repos;

    setupSession(function(server) {
      organization = server.create('organization', 'withUser');
      versionControlIntegration = server.create('versionControlIntegration', 'github');
      repos = server.createList('repo', 3);
      let disabled = server.create('project', {
        name: 'Disabled Project',
        isEnabled: false,
        organization,
      });
      let enabled = server.create('project', {name: 'Enabled Project', organization});

      this.enabledProject = enabled;
      this.disabledProject = disabled;
    });

    it('for disabled', async function() {
      await visit(`/${this.disabledProject.fullSlug}/settings`);
      expect(currentPath()).to.equal('organization.project.settings');
      expect(find('[data-test-sidenav-list-projects] li:eq(0)').text()).to.match(
        /Disabled Project/,
      );
      expect(find('[data-test-sidenav-list-projects] li:eq(1)').text()).to.match(/Enabled Project/);
      expect(find('[data-test-sidenav-list-projects] li:eq(2)').text()).to.match(
        /Create new project/,
      );

      await percySnapshot(this.test);
    });

    it('for enabled', async function() {
      await visit(`/${this.enabledProject.fullSlug}/settings`);
      expect(currentPath()).to.equal('organization.project.settings');
      expect(find('[data-test-sidenav-list-projects] li:eq(0)').text()).to.match(
        /Disabled Project/,
      );
      expect(find('[data-test-sidenav-list-projects] li:eq(1)').text()).to.match(/Enabled Project/);
      expect(find('[data-test-sidenav-list-projects] li:eq(2)').text()).to.match(
        /Create new project/,
      );

      await percySnapshot(this.test);
    });

    it('displays github integration select menu', async function() {
      organization.update({versionControlIntegrations: [versionControlIntegration], repos});

      await visit(`/${this.enabledProject.fullSlug}/settings`);
      await percySnapshot(this.test);
    });

    context('admin mode', function() {
      // This is necessary while the auto-approve-branch-filter part of the settings page
      // is behind the is-admin flag:
      beforeEach(function() {
        adminMode.setAdminMode();
      });
      afterEach(function() {
        adminMode.clear();
      });

      it('displays Auto-Approve Branches setting', async function() {
        await visit(`/${this.enabledProject.fullSlug}/settings`);
        await percySnapshot(this.test);

        expect(find('h4:contains("Auto-Approve Branches")').length).to.equal(1);
      });
    });
  });

  describe('builds', function() {
    freezeMoment('2018-05-22');

    let urlParams;

    setupSession(function(server) {
      let organization = server.create('organization', 'withUser');
      let project = server.create('project', {
        name: 'project with builds',
        organization,
      });
      server.create('project', {
        name: 'project without builds',
        organization,
      });

      urlParams = {
        orgSlug: organization.slug,
        projectSlug: project.slug,
      };

      function _timeAgo(quantity, timeUnit) {
        return moment().subtract(quantity, timeUnit);
      }

      server.create('build', 'withSnapshots', {project, createdAt: _timeAgo(60, 'days')});
      server.create('build', 'expired', {project, createdAt: _timeAgo(30, 'hours')});
      server.create('build', 'failed', {project, createdAt: _timeAgo(3, 'hours')});
      server.create('build', 'failedWithTimeout', {project, createdAt: _timeAgo(25, 'minutes')});
      server.create('build', 'failedWithNoSnapshots', {
        project,
        createdAt: _timeAgo(25, 'minutes'),
      });
      server.create('build', 'failedWithMissingResources', {
        project,
        createdAt: _timeAgo(15, 'minutes'),
      });
      server.create('build', 'pending', {project, createdAt: _timeAgo(10, 'minutes')});
      server.create('build', 'approved', {project, createdAt: _timeAgo(5, 'minutes')});
      server.create('build', 'approvedPreviously', {project, createdAt: _timeAgo(4, 'minutes')});
      server.create('build', 'approvedWithNoDiffs', {project, createdAt: _timeAgo(2, 'minutes')});
      server.create('build', 'processing', {project, createdAt: _timeAgo(10, 'seconds')});
      this.project = project;
    });

    it('shows builds on index', async function() {
      await ProjectPage.visitProject(urlParams);
      await percySnapshot(this.test);
      expect(currentPath()).to.equal('organization.project.index');
    });

    it('navigates to build page after clicking build', async function() {
      await ProjectPage.visitProject(urlParams);
      expect(currentPath()).to.equal('organization.project.index');

      await ProjectPage.finishedBuilds[0].click();
      expect(currentPath()).to.equal('organization.project.builds.build.index');

      await percySnapshot(this.test.fullTitle());
    });
  });
});
