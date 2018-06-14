import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {make, makeList} from 'ember-data-factory-guy';
import {clickTrigger} from 'ember-power-select/test-support/helpers';
import RepoIntegrator from 'percy-web/tests/pages/components/repo-integrator';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import repoRefreshServiceStub from 'percy-web/tests/helpers/mock-repo-refresh-service';
import moment from 'moment';
import sinon from 'sinon';

describe('Integration: RepoIntegratorComponent', function() {
  setupComponentTest('repo-integrator', {
    integration: true,
  });

  beforeEach(function() {
    RepoIntegrator.setContext(this);
    setupFactoryGuy(this.container);
  });

  describe('with a github integration', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make('organization', 'withGithubIntegration', 'withGithubRepos');
      project.set('organization', organization);

      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      this.render(hbs`{{projects/repo-integrator project=project}}`);
    });

    it('renders powerselect closed', function() {
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      clickTrigger();
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.dropdown.groups(0).name).to.eq('GitHub');

      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a gitlab integration', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make('organization', 'withGitlabIntegration', 'withGitlabRepos');
      project.set('organization', organization);

      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      this.render(hbs`{{projects/repo-integrator project=project}}`);
    });

    it('renders powerselect closed', function() {
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      clickTrigger();
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.dropdown.groups(0).name).to.eq('GitLab');

      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a github enterprise integration', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make(
        'organization',
        'withGithubEnterpriseIntegration',
        'withGithubEnterpriseRepos',
      );
      project.set('organization', organization);
      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      this.render(hbs`{{projects/repo-integrator project=project}}`);
    });

    it('renders powerselect closed', function() {
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      clickTrigger();
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.dropdown.groups(0).name).to.eq('GitHub Enterprise');

      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with multiple integrations', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make('organization', 'withMultipleIntegrations');
      project.set('organization', organization);
      this.setProperties({project});
      repoRefreshServiceStub(this, null, null);
      this.render(hbs`{{projects/repo-integrator project=project}}`);
    });

    it('renders powerselect closed', function() {
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      clickTrigger();
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.dropdown.groups(0).name).to.eq('GitHub');
      expect(RepoIntegrator.dropdown.groups(1).name).to.eq('GitLab');
      expect(RepoIntegrator.dropdown.groups(2).name).to.eq('GitHub Enterprise');
      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with no integrations', function() {
    let freshReposStub;
    beforeEach(function() {
      const project = make('project');
      const organization = make('organization', {lastSyncedAt: undefined});
      project.set('organization', organization);

      this.setProperties({project});

      freshReposStub = sinon.stub();
      repoRefreshServiceStub(this, null, null, freshReposStub);

      this.render(hbs`{{projects/repo-integrator project=project}}`);
    });

    it('displays no integrations message', function() {
      expect(RepoIntegrator.isNoIntegrationsMessageVisible).to.equal(true);
      percySnapshot(this.test.fullTitle());
    });

    it('does not call getFreshRepos', function() {
      expect(freshReposStub).to.not.have.been.called;
    });
  });

  describe('with stale repos', function() {
    let project;
    let organization;
    let oldRepos;
    let oldUpdatedAt;
    beforeEach(function() {
      project = make('project');
      organization = make('organization', 'withMultipleIntegrations', 'withStaleRepoData');

      project.set('organization', organization);
      this.setProperties({project});
    });

    it('shows that the repos are out of date', async function() {
      oldRepos = organization.get('repos');
      oldUpdatedAt = organization.get('lastSyncedAt');
      repoRefreshServiceStub(this, oldRepos, oldUpdatedAt);
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      await clickTrigger();
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.repoFreshness.message).to.eq('Last updated: 20 minutes ago');
      percySnapshot(this.test.fullTitle());
    });

    it('refreshes the repo collection', async function() {
      const expectedRepoCount = 10;
      const newRepos = makeList('repo', expectedRepoCount, 'githubEnterprise');
      const newUpdatedAt = moment().subtract(1, 'minutes');
      repoRefreshServiceStub(this, newRepos, newUpdatedAt);
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      await clickTrigger();
      expect(RepoIntegrator.dropdown.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.dropdown.options.count).to.eq(expectedRepoCount);
      expect(RepoIntegrator.repoFreshness.message).to.eq('Last updated: a minute ago');

      percySnapshot(this.test.fullTitle());
    });
  });
});
