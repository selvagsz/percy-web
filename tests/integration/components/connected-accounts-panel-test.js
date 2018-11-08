/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupRenderingTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import CAPPageObject from 'percy-web/tests/pages/components/connected-accounts-panel';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: ConnectedAccountsPanel', function() {
  setupRenderingTest('connected-accounts-panel', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    CAPPageObject.setContext(this);
  });

  describe('when a user has only a github identity', function() {
    let deleteStub;
    let addStub;
    let identity;
    beforeEach(async function() {
      const user = make('user', {name: 'fardeedoo'});
      identity = make('identity', 'githubProvider', {user});
      deleteStub = sinon.stub();
      addStub = sinon.stub();

      this.set('identities', [identity]);
      this.set('actions', {
        deleteIdentity: deleteStub,
        addIdentity: addStub,
      });

      await this.render(hbs`{{
        connected-accounts-panel
        identities=identities
        deleteIdentity=(action "deleteIdentity")
        addIdentity=(action "addIdentity")
      }}`);
    });

    it('displays correctly', async function() {
      await percySnapshot(this.test.fullTitle());
      expect(CAPPageObject.isDeleteGithubIdentityVisible).to.equal(false);
      expect(CAPPageObject.isAddAuth0IdentityVisible).to.equal(true);
      expect(CAPPageObject.isAddGithubIdentityVisible).to.equal(false);
    });

    it('calls addIdentity action when add button is clicked', async function() {
      await CAPPageObject.clickAddAuth0Identity();
      expect(addStub).to.have.been.calledWith('auth0');
    });
  });

  describe('when a user has only an email/password identity', function() {
    let deleteStub;
    let addStub;
    beforeEach(async function() {
      const user = make('user', {name: 'fardeedoo'});
      const identity = make('identity', 'auth0Provider', {user});
      deleteStub = sinon.stub();
      addStub = sinon.stub();

      this.set('identities', [identity]);
      this.set('actions', {
        deleteIdentity: deleteStub,
        addIdentity: addStub,
      });

      await this.render(hbs`{{
        connected-accounts-panel
        identities=identities
        deleteIdentity=(action "deleteIdentity")
        addIdentity=(action "addIdentity")
      }}`);
    });

    it('displays correctly', async function() {
      await percySnapshot(this.test.fullTitle());
      expect(CAPPageObject.isDeleteAuth0IdentityVisible).to.equal(false);
      expect(CAPPageObject.isAddAuth0IdentityVisible).to.equal(false);
      expect(CAPPageObject.isAddGithubIdentityVisible).to.equal(true);
    });

    it('calls addIdentity action when add button is clicked', async function() {
      await CAPPageObject.clickAddGithubIdentity();
      expect(addStub).to.have.been.calledWith('github');
    });
  });

  describe('when a user has both an email/password identity and a github identity', function() {
    let deleteStub;
    let auth0Identity;

    beforeEach(async function() {
      const user = make('user', {name: 'fardeedoo'});
      auth0Identity = make('identity', 'auth0Provider', {user});
      const githubIdentity = make('identity', 'githubProvider', {user});
      const addStub = sinon.stub();
      deleteStub = sinon.stub();

      this.set('identities', [auth0Identity, githubIdentity]);
      this.set('actions', {
        deleteIdentity: deleteStub,
        addIdentity: addStub,
      });

      await this.render(hbs`{{
        connected-accounts-panel
        identities=identities
        deleteIdentity=(action "deleteIdentity")
        addIdentity=(action "addIdentity")
      }}`);
    });

    it('displays correctly', async function() {
      await percySnapshot(this.test.fullTitle());
      expect(CAPPageObject.isDeleteAuth0IdentityVisible).to.equal(true);
      expect(CAPPageObject.isDeleteGithubIdentityVisible).to.equal(true);
      expect(CAPPageObject.isAddAuth0IdentityVisible).to.equal(false);
      expect(CAPPageObject.isAddGithubIdentityVisible).to.equal(false);
    });

    it('calls delete action when delete button is clicked', async function() {
      await CAPPageObject.clickDeleteAuth0Identity();
      expect(deleteStub).to.have.been.calledWith(auth0Identity.get('id'));
    });
  });
});
