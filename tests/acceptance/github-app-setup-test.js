import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import {percySnapshot} from 'ember-percy';
import {visit, currentRouteName} from '@ember/test-helpers';

describe('Acceptance: GitHub App Setup', function() {
  setupAcceptance();
  let githubInstallationId;

  setupSession(function(server) {
    this.organization = server.create('organization', 'withUser', 'withGithubIntegration', {
      name: 'test org',
    });
    githubInstallationId = this.organization.versionControlIntegrations.models[0]
      .githubInstallationId;
    expect(githubInstallationId).to.be.ok; // eslint-disable-line no-unused-expressions
  });

  it('shows GitHub integration processing page', async function() {
    await visit('/setup/github-app?installation_id=123');
    expect(currentRouteName()).to.equal('setup.github-app');

    await percySnapshot(this.test);
  });

  it('redirects to organization page when the installation_id is present', async function() {
    await visit(`/setup/github-app?installation_id=${githubInstallationId}`);
    expect(currentRouteName()).to.equal('organization.index');
  });

  context('with a project', function() {
    setupSession(function(server) {
      server.create('project', {organization: this.organization});
    });
    it('redirects to settings when the installation_id and project present', async function() {
      await visit(`/setup/github-app?installation_id=${githubInstallationId}`);
      expect(currentRouteName()).to.equal('organizations.organization.integrations.index');
    });
  });
});
