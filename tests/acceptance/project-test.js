import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import freezeMoment from '../helpers/freeze-moment';
import moment from 'moment';
import ProjectPage from 'percy-web/tests/pages/project-page';
import ProjectSettingsPage from 'percy-web/tests/pages/project-settings-page';
import sinon from 'sinon';
import {beforeEach} from 'mocha';
import {withVariation} from 'ember-launch-darkly/test-support/helpers/with-variation';
import {percySnapshot} from 'ember-percy';
import {click, visit, currentRouteName} from '@ember/test-helpers';

describe('Acceptance: Project', function() {
  setupAcceptance();

  describe('organization has no projects', function() {
    setupSession(function(server) {
      this.organization = server.create('organization', 'withUser');
    });

    it('can create', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentRouteName()).to.equal('organization.index');
      await percySnapshot(this.test.fullTitle() + ' | index');

      await click('.data-test-create-first-project');
      expect(currentRouteName()).to.equal('organizations.organization.projects.new');

      await percySnapshot(this.test.fullTitle() + ' | new project');
    });

    it('shows public notice when org is sponsored', async function() {
      const subscription = server.create('subscription', 'withSponsoredPlan');
      this.organization.update({subscription});
      await visit(`organizations/${this.organization.slug}/projects/new`);
      await percySnapshot(this.test.fullTitle() + ' | new project');
    });
  });

  describe('organization with admin user has no projects', function() {
    setupSession(function(server) {
      this.organization = server.create('organization', 'withAdminUser');
    });

    it('shows admin specific links', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentRouteName()).to.equal('organization.index');
      await percySnapshot(this.test.fullTitle() + ' | index | admin mode');
    });

    it('links to invite team members page', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentRouteName()).to.equal('organization.index');

      await click('.data-test-invite-team-members');
      expect(currentRouteName()).to.equal('organizations.organization.users.invite');
    });

    it('links to install github intergration page', async function() {
      await visit(`/${this.organization.slug}`);
      expect(currentRouteName()).to.equal('organization.index');

      await click('.data-test-install-github');
      expect(currentRouteName()).to.equal('organizations.organization.integrations.github');
    });
  });

  describe('waiting for first build', function() {
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
      expect(currentRouteName()).to.equal('organization.project.index');

      await percySnapshot(this.test);
      await ProjectPage.clickQuickstartButton();
      await percySnapshot(this.test.fullTitle() + ' | demo project instructions are visible');
    });

    it('polls for updates and updates the list when a build is created', async function() {
      const url = `projects/${urlParams.orgSlug}/${urlParams.projectSlug}/builds`;
      server.create('build', 'withSnapshots', {id: 'foo', project: this.project});

      let hasVisitedBuildPage = false;
      server.get(url, () => {
        if (!hasVisitedBuildPage) {
          hasVisitedBuildPage = true;
          return {data: []};
        } else {
          return server.schema.builds.where({id: 'foo'});
        }
      });

      await ProjectPage.visitProject(urlParams);

      expect(ProjectPage.builds().count).to.equal(1);
    });
  });

  describe('settings', function() {
    let organization;
    let enabledProject;
    let disabledProject;
    let versionControlIntegration;
    let repos;
    let webhookConfig;

    setupSession(function(server) {
      organization = server.create('organization', 'withUser');
      versionControlIntegration = server.create('versionControlIntegration', 'github');
      repos = server.createList('repo', 3);
      webhookConfig = server.create('webhookConfig');
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

      expect(currentRouteName()).to.equal('organization.project.settings');
      expect(ProjectSettingsPage.projectLinks(0).projectName).to.match(/Enabled Project/);
      expect(ProjectSettingsPage.projectLinks(1).projectName).to.match(/Disabled Project/);
      expect(ProjectSettingsPage.projectLinks(2).projectName).to.match(/Create new project/);

      await percySnapshot(this.test);
    });

    it('for enabled', async function() {
      await ProjectSettingsPage.visitProjectSettings({
        orgSlug: organization.slug,
        projectSlug: enabledProject.slug,
      });

      expect(currentRouteName()).to.equal('organization.project.settings');
      expect(ProjectSettingsPage.projectLinks(0).projectName).to.match(/Enabled Project/);
      expect(ProjectSettingsPage.projectLinks(1).projectName).to.match(/Disabled Project/);
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

    it('shows support', async function() {
      window.Intercom = sinon.stub();

      await ProjectSettingsPage.visitProjectSettings({
        orgSlug: organization.slug,
        projectSlug: enabledProject.slug,
      });

      ProjectSettingsPage.clickShowSupport();
      expect(window.Intercom).to.have.been.called;
    });

    it('displays webhook configs', async function() {
      enabledProject.update({webhookConfigs: [webhookConfig]});

      await ProjectSettingsPage.visitProjectSettings({
        orgSlug: organization.slug,
        projectSlug: enabledProject.slug,
      });

      await percySnapshot(this.test);

      expect(ProjectSettingsPage.webhookConfigList.webhookConfigs(0).url).to.equal(
        webhookConfig.url,
      );
    });

    it('transitions to webhook config form', async function() {
      window.crypto.getRandomValues = sinon.fake.returns(new Uint8Array(32));

      await ProjectSettingsPage.visitProjectSettings({
        orgSlug: organization.slug,
        projectSlug: enabledProject.slug,
      });

      await ProjectSettingsPage.webhookConfigList.newWebhookConfig();

      await percySnapshot(this.test);

      expect(currentRouteName()).to.equal(
        'organization.project.integrations.webhooks.webhook-config',
      );
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

    describe('updating project settings', function() {
      it('sends correct data', async function() {
        withVariation(this.owner, 'public-project-switch', true); // eslint-disable-line

        const stub = sinon.stub();
        server.patch('/projects/:full_slug', function(schema, request) {
          const fullSlug = decodeURIComponent(request.params.full_slug);
          const attrs = this.normalizedRequestAttrs();
          const project = schema.projects.findBy({fullSlug: fullSlug});
          project.update(
            Object.assign(attrs, {fullSlug: 'my_organization_that_i_love_and_cherish_0/new-slug'}),
          );
          stub(attrs);
          server.create('project', attrs);
          return project;
        });

        await ProjectSettingsPage.visitProjectSettings({
          orgSlug: organization.slug,
          projectSlug: enabledProject.slug,
        });

        await ProjectSettingsPage.projectEditForm.togglePublicCheckbox();
        await ProjectSettingsPage.projectEditForm.fillInProjectName('new-name');
        await ProjectSettingsPage.projectEditForm.fillInProjectSlug('new-slug');
        await ProjectSettingsPage.projectEditForm.clickSave();

        expect(stub).to.have.been.called;
        expect(stub.args[0][0]).to.include({
          name: 'new-name',
          slug: 'new-slug',
          publiclyReadable: true,
        });

        expect(currentRouteName()).to.equal('organization.project.index');
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

      server.create('build', 'withSnapshots', {
        project,
        createdAt: _timeAgo(60, 'days'),
        buildNumber: 1,
      });
      server.create('build', 'expired', {
        project,
        createdAt: _timeAgo(30, 'hours'),
        buildNumber: 2,
      });
      server.create('build', 'failed', {
        project,
        createdAt: _timeAgo(3, 'hours'),
        buildNumber: 3,
      });
      server.create('build', 'failedWithTimeout', {
        project,
        createdAt: _timeAgo(25, 'minutes'),
        buildNumber: 4,
      });
      server.create('build', 'failedWithNoSnapshots', {
        project,
        createdAt: _timeAgo(25, 'minutes'),
        buildNumber: 5,
      });
      server.create('build', 'failedWithMissingResources', {
        project,
        createdAt: _timeAgo(15, 'minutes'),
        buildNumber: 6,
      });
      server.create('build', 'pending', {
        project,
        createdAt: _timeAgo(10, 'minutes'),
        buildNumber: 7,
      });
      server.create('build', 'approved', {
        project,
        createdAt: _timeAgo(5, 'minutes'),
        buildNumber: 8,
      });
      server.create('build', 'approvedPreviously', {
        project,
        createdAt: _timeAgo(4, 'minutes'),
        buildNumber: 9,
      });
      server.create('build', 'approvedWithNoDiffs', {
        project,
        createdAt: _timeAgo(2, 'minutes'),
        buildNumber: 10,
      });
      server.create('build', 'approvedAutoBranch', {
        project,
        createdAt: _timeAgo(3, 'minutes'),
        buildNumber: 11,
      });
      server.create('build', 'processing', {
        project,
        createdAt: _timeAgo(10, 'seconds'),
        buildNumber: 12,
      });

      this.project = project;
    });

    it('shows builds on index', async function() {
      await ProjectPage.visitProject(urlParams);
      await percySnapshot(this.test);
      expect(currentRouteName()).to.equal('organization.project.index');
    });

    it('hides the loader when there are less than 50 builds', async function() {
      await ProjectPage.visitProject(urlParams);

      expect(ProjectPage.infinityLoader.isPresent).to.equal(false);
      expect(ProjectPage.builds().count).to.equal(12);
    });

    it('shows the loader when there are more than 50 builds', async function() {
      // 50 comes from INFINITY_SCROLL_LIMIT in the build model
      server.createList('build', 50, {project: this.project});

      await ProjectPage.visitProject(urlParams);

      // expect infinity loader to be present
      expect(ProjectPage.infinityLoader.isPresent).to.equal(true);
    });

    it('navigates to build page after clicking build', async function() {
      await ProjectPage.visitProject(urlParams);
      expect(currentRouteName()).to.equal('organization.project.index');
      await ProjectPage.finishedBuilds[4].click();
      expect(currentRouteName()).to.equal('organization.project.builds.build.index');

      await percySnapshot(this.test.fullTitle());
    });
  });
});
