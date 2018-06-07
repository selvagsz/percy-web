import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import {make} from 'ember-data-factory-guy';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import NewOrganization from 'percy-web/tests/pages/components/new-organization';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import Service from '@ember/service';

describe('Integration | Component | organizations/new-organization', function() {
  setupComponentTest('organizations/new-organization', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this.container);
    NewOrganization.setContext(this);
    this.set('githubMarketplacePlanId', 9);
    this.set('organizationCreated', () => {});

    const user = make('user');
    this.set('user', user);
    const sessionServiceStub = Service.extend({
      currentUser: user,
    });
    this.register('service:session', sessionServiceStub);
    this.inject.service('session', {as: 'sessionService'});
  });

  describe('when not a github marketplace purchase', function() {
    beforeEach(function() {
      this.render(hbs`{{organizations/new-organization
        organizationCreated=organizationCreated
      }}`);
    });

    it('hides the connect github account section', function() {
      expect(NewOrganization.hasGithubSection).to.equal(false);
      percySnapshot(this.test);
    });

    it('disables the form submission button on load', function() {
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(true);
    });

    it('enables the form submission button when a valid name is entered', function() {
      NewOrganization.organizationName('my-cool-organization');
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(false);
    });
  });

  describe('when a github marketplace purchase without github connected', function() {
    beforeEach(function() {
      this.render(hbs`{{organizations/new-organization
        githubMarketplacePlanId=githubMarketplacePlanId
        organizationCreated=organizationCreated
      }}`);
    });

    it('shows the connect github account section', function() {
      expect(NewOrganization.hasGithubSection).to.equal(true);
      percySnapshot(this.test);
    });

    it('shows the connect to github button', function() {
      expect(NewOrganization.hasConnectToGithubButton).to.equal(true);
    });

    it('disables the form submission button', function() {
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(true);
    });
  });

  describe('when a github marketplace purchase with github connected', function() {
    beforeEach(function() {
      const identity = make('identity', 'githubProvider', {nickname: 'myGithubAccount'});
      this.set('user.identities', [identity]);

      this.render(hbs`{{organizations/new-organization
        githubMarketplacePlanId=githubMarketplacePlanId
        organizationCreated=organizationCreated
      }}`);
    });

    it('shows the connect github account section', function() {
      expect(NewOrganization.hasGithubSection).to.equal(true);
    });

    it('shows the connected github user', function() {
      expect(NewOrganization.hasConnectedGithubAccount).to.equal(true);
      expect(NewOrganization.githubAccountName).to.equal('myGithubAccount');
      percySnapshot(this.test);
    });

    it('disables the form submission button on load', function() {
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(true);
    });

    it('enables the form submission button when a valid name is entered', function() {
      NewOrganization.organizationName('my-cool-organization');
      expect(NewOrganization.isCreateNewOrganizationDisabled).to.equal(false);
    });
  });
});
