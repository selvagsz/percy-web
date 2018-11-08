import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import {make} from 'ember-data-factory-guy';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import IntegrationItem from 'percy-web/tests/pages/components/integration-item';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import AdminMode from 'percy-web/lib/admin-mode';
import mockIntercomService from 'percy-web/tests/helpers/mock-intercom-service';
import sinon from 'sinon';

describe('Integration | Component | organizations/integrations/integration-item', function() {
  setupRenderingTest('organizations/integrations/integration-item', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    IntegrationItem.setContext(this);
    AdminMode.clear();
  });

  describe('with no integrations installed', function() {
    beforeEach(function() {
      const organization = make('organization');
      this.set('organization', organization);
    });

    it('shows the intall button for github', async function() {
      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github"
        organization=organization}}`);

      expect(IntegrationItem.hasInstallButton).to.equal(true);
      await percySnapshot(this.test);
    });

    it('shows the contact us button for github enterprise', async function() {
      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github_enterprise"
        organization=organization}}`);

      expect(IntegrationItem.hasContactButton).to.equal(true);
      await percySnapshot(this.test);
    });

    it('shows the install button for gitlab', async function() {
      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab"
        organization=organization}}`);

      expect(IntegrationItem.hasInstallButton).to.equal(true);
      await percySnapshot(this.test);
    });

    it('shows the contact us button for gitlab self-hosted', async function() {
      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab_self_hosted"
        organization=organization}}`);

      expect(IntegrationItem.hasInstallButton, 'Install button is mising').to.equal(true);

      await percySnapshot(this.test);
    });

    it('links to the github enterprise form', async function() {
      const formLink = 'https://docs.percy.io/docs/github-enterprise';

      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github_enterprise"
        organization=organization}}`);

      expect(IntegrationItem.contactButtonLink).to.equal(formLink);
    });

    it('does not show the beta badge for github', async function() {
      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github"
        organization=organization}}`);

      expect(IntegrationItem.hasBetaBadge).to.equal(false);
    });

    it('does not show the beta badge for github enterprise', async function() {
      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github_enterprise"
        organization=organization}}`);

      expect(IntegrationItem.hasBetaBadge).to.equal(false);
    });
  });

  describe('as an installed github integration item', function() {
    beforeEach(async function() {
      const organization = make('organization', 'withGithubIntegration');
      this.set('organization', organization);

      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github"
        organization=organization}}`);
    });

    it('shows the edit settings button', async function() {
      expect(IntegrationItem.hasEditButton).to.equal(true);
      await percySnapshot(this.test);
    });
  });

  describe('as an installed github enterprise integration item', function() {
    beforeEach(async function() {
      const organization = make('organization', 'withGithubEnterpriseIntegration');
      this.set('organization', organization);

      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="github_enterprise"
        organization=organization}}`);
    });

    it('shows the contact us button', async function() {
      const showSupportStub = sinon.stub();
      mockIntercomService(this, showSupportStub);

      expect(IntegrationItem.hasContactButton).to.equal(true);

      await percySnapshot(this.test);

      await IntegrationItem.clickContactButton();
      expect(showSupportStub).to.have.been.called;
    });
  });

  describe('as an installed gitlab integration item', function() {
    beforeEach(async function() {
      const organization = make('organization', 'withGitlabIntegration');
      this.set('organization', organization);

      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab"
        organization=organization}}`);
    });

    it('shows the edit settings button', async function() {
      expect(IntegrationItem.hasEditButton).to.equal(true);
      await percySnapshot(this.test);
    });
  });

  describe('with an unauthorized gitlab integration', function() {
    beforeEach(async function() {
      const organization = make('organization', 'withUnauthorizedGitlabIntegration');
      this.set('organization', organization);

      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab"
        integrationStatus="unauthorized"
        organization=organization}}`);
    });

    it('has a badge to signify the integration is disabled', async function() {
      expect(IntegrationItem.hasDisabledBadge).to.equal(true);
      await percySnapshot(this.test);
    });
  });

  describe('with an invalid gitlab self-managed hostname', function() {
    beforeEach(async function() {
      const organization = make('organization', 'withInvalidHostnameGitlabSelfHostedIntegration');
      this.set('organization', organization);

      await this.render(hbs`{{organizations/integrations/integration-item
        integrationName="gitlab_self_hosted"
        integrationStatus="invalid_hostname"
        organization=organization}}`);
    });

    it('has a badge to signify the integration is disabled', async function() {
      expect(IntegrationItem.hasDisabledBadge).to.equal(true);
      await percySnapshot(this.test);
    });
  });
});
