import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import {percySnapshot} from 'ember-percy';
import {make} from 'ember-data-factory-guy';
import {clickTrigger} from 'ember-power-select/test-support/helpers';
import RepoIntegrator from 'percy-web/tests/pages/components/repo-integrator';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

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
    });

    it('renders powerselect closed', function() {
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      expect(RepoIntegrator.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      clickTrigger();
      expect(RepoIntegrator.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.groups(0).name).to.eq('GitHub');

      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with a gitlab integration', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make('organization', 'withGitlabIntegration', 'withGitlabRepos');
      project.set('organization', organization);

      this.setProperties({project});
    });

    it('renders powerselect closed', function() {
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      expect(RepoIntegrator.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      clickTrigger();
      expect(RepoIntegrator.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.groups(0).name).to.eq('GitLab');

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
    });

    it('renders powerselect closed', function() {
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      expect(RepoIntegrator.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      clickTrigger();
      expect(RepoIntegrator.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.groups(0).name).to.eq('GitHub Enterprise');

      percySnapshot(this.test.fullTitle());
    });
  });

  describe('with multiple integrations', function() {
    beforeEach(function() {
      const project = make('project');
      const organization = make('organization', 'withMultipleIntegrations');
      project.set('organization', organization);
      this.setProperties({project});
    });

    it('renders powerselect closed', function() {
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      expect(RepoIntegrator.isSelectorOpen).to.eq(false);

      percySnapshot(this.test.fullTitle());
    });

    it('renders powerselect open', function() {
      this.render(hbs`{{projects/repo-integrator project=project}}`);
      clickTrigger();
      expect(RepoIntegrator.isSelectorOpen).to.eq(true);
      expect(RepoIntegrator.groups(0).name).to.eq('GitHub');
      expect(RepoIntegrator.groups(1).name).to.eq('GitLab');
      expect(RepoIntegrator.groups(2).name).to.eq('GitHub Enterprise');

      percySnapshot(this.test.fullTitle());
    });
  });
});
