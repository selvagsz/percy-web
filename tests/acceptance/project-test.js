import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import freezeMoment from '../helpers/freeze-moment';
import moment from 'moment';
import ProjectPage from 'percy-web/tests/pages/project-page';
import ProjectSettingsPage from 'percy-web/tests/pages/project-settings-page';
import sinon from 'sinon';
import {beforeEach} from 'mocha';

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

  describe('organization with admin user has no projects', function() {
    setupSession(function(server) {
      this.organization = server.create('organization', 'withAdminUser');
    });

    it('shows admin specific links', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentPath()).to.equal('organization.index');
      await percySnapshot(this.test.fullTitle() + ' | index | admin mode');
    });

    it('links to invite team members page', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentPath()).to.equal('organization.index');

      await click('a:contains("invite team members")');
      expect(currentPath()).to.equal('organizations.organization.users.invite');
    });

    it('links to install github intergration page', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentPath()).to.equal('organization.index');

      await click('a:contains("GitHub")');
      expect(currentPath()).to.equal('organizations.organization.integrations.github');
    });
  });

  describe('waiting for first snapshot', function() {
    let urlParams;
    setupSession(function(server) {
      let organization = server.create('organization', 'withUser');
      let project = server.create('project', {
        name: 'My Project Name',
        organization,
      });
      server.create('token', {project});
      this.project = project;

      urlParams = {
        orgSlug: organization.slug,
        projectSlug: project.slug,
      };
    });

    it('shows environment variables and demo project instructions', async function() {
      await ProjectPage.visitProject(urlParams);
      expect(currentPath()).to.equal('organization.project.index');

      await percySnapshot(this.test);
      await ProjectPage.clickQuickstartButton();
      await percySnapshot(this.test.fullTitle() + ' | demo project instructions are visible');
    });
  });

  describe('settings', function() {
    let organization;
    let enabledProject;
    let disabledProject;
    let versionControlIntegration;
    let repos;

    setupSession(function(server) {
      organization = server.create('organization', 'withUser');
      versionControlIntegration = server.create('versionControlIntegration', 'github');
      repos = server.createList('repo', 3);
      disabledProject = server.create('project', {
        name: 'Disabled Project',
        isEnabled: false,
        organization,
      });
      enabledProject = server.create('project', 'withChromeAndFirefox', {
        name: 'Enabled Project',
        organization,
      });
    });

    it('for disabled', async function() {
      await ProjectSettingsPage.visitProjectSettings({
        orgSlug: organization.slug,
        projectSlug: disabledProject.slug,
      });

      expect(currentPath()).to.equal('organization.project.settings');
      expect(ProjectSettingsPage.projectLinks(0).projectName).to.match(/Disabled Project/);
      expect(ProjectSettingsPage.projectLinks(1).projectName).to.match(/Enabled Project/);
      expect(ProjectSettingsPage.projectLinks(2).projectName).to.match(/Create new project/);

      await percySnapshot(this.test);
    });

    it('for enabled', async function() {
      await ProjectSettingsPage.visitProjectSettings({
        orgSlug: organization.slug,
        projectSlug: enabledProject.slug,
      });

      expect(currentPath()).to.equal('organization.project.settings');
      expect(ProjectSettingsPage.projectLinks(0).projectName).to.match(/Disabled Project/);
      expect(ProjectSettingsPage.projectLinks(1).projectName).to.match(/Enabled Project/);
      expect(ProjectSettingsPage.projectLinks(2).projectName).to.match(/Create new project/);

      await percySnapshot(this.test);
    });

    it('displays github integration select menu', async function() {
      organization.update({versionControlIntegrations: [versionControlIntegration], repos});

      await ProjectSettingsPage.visitProjectSettings({
        orgSlug: organization.slug,
        projectSlug: enabledProject.slug,
      });
      await percySnapshot(this.test);
    });

    it('displays Auto-Approve Branches setting', async function() {
      await ProjectSettingsPage.visitProjectSettings({
        orgSlug: organization.slug,
        projectSlug: enabledProject.slug,
      });
      await percySnapshot(this.test);

      expect(ProjectSettingsPage.isAutoApproveBranchesVisible).to.equal(true);
    });

    describe('browser toggling', function() {
      let deleteStub;
      let createStub;
      let projectWithBothBrowsers;
      let projectWithFirefoxOnly;

      const createData = {
        data: {
          relationships: {
            'browser-family': {data: {type: 'browser-families', id: '2'}},
            project: {data: {type: 'projects', id: '2'}},
          },
          type: 'project-browser-targets',
        },
      };

      beforeEach(function() {
        deleteStub = sinon.stub();
        createStub = sinon.stub();
        projectWithBothBrowsers = enabledProject;
        projectWithFirefoxOnly = server.create('project', 'withFirefox', {organization});

        server.del('/project-browser-targets/:id', (schema, request) => {
          deleteStub(request.url);
        });

        server.post('/project-browser-targets', () => {
          createStub(createData);
          // This response object is not used for testing,
          // it is only used to make mirage think it has recieved a valid response.
          return server.create('projectBrowserTarget', {
            project: projectWithFirefoxOnly,
            browserTarget: server.create('browserTarget', 'withChromeBrowserFamily'),
          });
        });
      });

      it('calls correct endpoint when removing a browser', async function() {
        await ProjectSettingsPage.visitProjectSettings({
          orgSlug: organization.slug,
          projectSlug: projectWithBothBrowsers.slug,
        });
        await ProjectSettingsPage.browserSelector.chromeButton.click();
        await percySnapshot(this.test);

        expect(deleteStub).to.have.been.calledWith('/api/v1/project-browser-targets/2');
      });

      it('calls correct endpoint when adding a browser', async function() {
        await ProjectSettingsPage.visitProjectSettings({
          orgSlug: organization.slug,
          projectSlug: projectWithFirefoxOnly.slug,
        });

        await ProjectSettingsPage.browserSelector.chromeButton.click();
        await percySnapshot(this.test);

        expect(createStub).to.have.been.calledWith(createData);
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
      server.create('build', 'approvedAutoBranch', {project, createdAt: _timeAgo(3, 'minutes')});
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
