import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import {make} from 'ember-data-factory-guy';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import NewOrganization from 'percy-web/tests/pages/components/new-organization';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import Service from '@ember/service';

describe('Integration: OrganizationsNewOrganization', function() {
  setupRenderingTest('organizations/new-organization', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    NewOrganization.setContext(this);
    this.set('githubMarketplacePlanId', 9);
    this.set('organizationCreated', () => {});

    const user = make('user');
    this.set('user', user);
    const sessionServiceStub = Service.extend({
      currentUser: user,
    });
    this.owner.register('service:session', sessionServiceStub, 'sessionService');
  });

  describe('when not a github marketplace purchase', function() {
    beforeEach(async function() {
      await this.render(hbs`{{organizations/new-organization
        organizationCreated=organizationCreated
      }}`);
    });

    it('hides the connect github account section', async function() {
      expect(NewOrganization.hasGithubSection).to.equal(false);
      await percySnapshot(this.test);
    });

    it('disables the form submission button on load', async function() {
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(true);
    });

    it('enables the form submission button when a valid name is entered', async function() {
      await NewOrganization.organizationName('my-cool-organization');
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(false);
    });
  });

  describe('when a github marketplace purchase without github connected', function() {
    beforeEach(async function() {
      await this.render(hbs`{{organizations/new-organization
        githubMarketplacePlanId=githubMarketplacePlanId
        organizationCreated=organizationCreated
      }}`);
    });

    it('shows the connect github account section', async function() {
      expect(NewOrganization.hasGithubSection).to.equal(true);
      await percySnapshot(this.test);
    });

    it('shows the connect to github button', async function() {
      expect(NewOrganization.hasConnectToGithubButton).to.equal(true);
    });

    it('disables the form submission button', async function() {
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(true);
    });
  });

  describe('when a github marketplace purchase with github connected', function() {
    beforeEach(async function() {
      const identity = make('identity', 'githubProvider', {nickname: 'myGithubAccount'});
      this.set('user.identities', [identity]);

      await this.render(hbs`{{organizations/new-organization
        githubMarketplacePlanId=githubMarketplacePlanId
        organizationCreated=organizationCreated
      }}`);
    });

    it('shows the connect github account section', async function() {
      expect(NewOrganization.hasGithubSection).to.equal(true);
    });

    it('shows the connected github user', async function() {
      expect(NewOrganization.hasConnectedGithubAccount).to.equal(true);
      expect(NewOrganization.githubAccountName).to.equal('myGithubAccount');
      await percySnapshot(this.test);
    });

    it('disables the form submission button on load', async function() {
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(true);
    });

    it('enables the form submission button when a valid name is entered', async function() {
      await NewOrganization.organizationName('my-cool-organization');
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(false);
    });
  });
});
