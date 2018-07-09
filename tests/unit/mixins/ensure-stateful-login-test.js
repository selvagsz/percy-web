/* eslint-disable no-unused-expressions */
import Ember from 'ember';
import {expect} from 'chai';
import {it, describe, beforeEach, afterEach} from 'mocha';
import sinon from 'sinon';
import EnsureStatefulLogin from 'percy-web/mixins/ensure-stateful-login';
import {startMirage} from 'percy-web/initializers/ember-cli-mirage';
import lockOptions from 'percy-web/lib/lock-settings';
import {all} from 'rsvp';
import localStorageProxy from 'percy-web/lib/localstorage';
import {AUTH_REDIRECT_LOCALSTORAGE_KEY} from 'percy-web/router';

describe('EnsureStatefulLoginMixin', function() {
  let subject;
  let fakeMethod;
  let getLockInstanceStub;
  let setupLockStub;
  let fakeLockInstance;
  const fakeStateToken = 'fakeStateToken';

  beforeEach(function() {
    // setup session endpont mock
    fakeMethod = sinon.stub();
    this.server = startMirage();
    this.server.namespace = '';
    this.server.get('/api/auth/session', () => {
      fakeMethod();
      return {state: fakeStateToken};
    });

    // setup fake auth0 service
    fakeLockInstance = {
      on: sinon.stub(),
      show: sinon.stub(),
      hide: sinon.stub(),
    };
    getLockInstanceStub = sinon.stub().returns(fakeLockInstance);
    setupLockStub = sinon.stub().returns((lock, resolve) => {
      resolve();
    });

    // inject mixin and fake auth0 service into test subject
    subject = Ember.Object.extend(EnsureStatefulLogin).create({
      session: {},
      transitionTo: sinon.stub(),
      auth0: Ember.Object.create({
        getAuth0LockInstance: getLockInstanceStub,
        _setupLock: setupLockStub,
      }),
    });
  });

  afterEach(function() {
    this.server.shutdown();
  });

  describe('showLoginModalEnsuringState', function() {
    it('sets state on lockOptions after getting state token', function() {
      subject.set('_hasOpenedLoginModal', false);
      const promise = subject.showLoginModalEnsuringState();

      return promise.then(() => {
        expect(lockOptions.auth.params.state).to.equal(fakeStateToken);
      });
    });

    it('calls show on lock instance after getting state token', function() {
      subject.set('_hasOpenedLoginModal', false);
      const promise = subject.showLoginModalEnsuringState();

      return promise.then(() => {
        expect(fakeLockInstance.show).to.have.been.called;
      });
    });

    it('calls _showLock only once, even if triggered twice', function() {
      sinon.spy(subject, '_getStateToken');
      sinon.spy(subject, '_showLock');
      const promise1 = subject.showLoginModalEnsuringState();
      const promise2 = subject.showLoginModalEnsuringState();

      return all([promise1, promise2]).then(() => {
        expect(subject._getStateToken).to.have.been.calledOnce;
        expect(subject._showLock).to.have.been.calledOnce;
      });
    });
  });

  describe('_showLock', function() {
    it('calls getAuth0LockInstance on auth0 service with correct options', function() {
      const options = {foo: 'bar'};
      subject._showLock(options);

      expect(getLockInstanceStub).to.have.been.calledWith(options);
    });

    it('calls _setupLock on auth0 service with lock instance', function() {
      subject._showLock();

      expect(setupLockStub).to.have.been.calledWith(
        fakeLockInstance,
        sinon.match.func,
        sinon.match.func,
      );
    });

    it('sets behavior on hide', function() {
      subject._showLock({}, 'thisArgIsPresent');

      expect(fakeLockInstance.on).to.have.been.calledWith('hide', sinon.match.func);
    });

    it('calls show on lock instance', function() {
      subject._showLock();

      expect(fakeLockInstance.show).to.have.been.called;
    });

    it('stores instance of lock on session service', function() {
      subject._showLock();
      expect(subject.get('session.lockInstance')).to.equal(fakeLockInstance);
    });
  });

  describe('_closeLock', function() {
    it('calls hide on session.lockInstance', function() {
      subject.set('session.lockInstance', fakeLockInstance);
      subject.closeLock();
      expect(fakeLockInstance.hide).to.have.been.called;
    });
  });

  describe('_onLockClosed', function() {
    it('sets _hasOpenedLoginModal to false', function() {
      subject.set('_hasOpenedLoginModal', true);
      subject._onLockClosed();

      expect(subject.get('_hasOpenedLoginModal')).to.equal(false);
    });

    it('removes redirect route from sessionStorage', function() {
      localStorageProxy.set(AUTH_REDIRECT_LOCALSTORAGE_KEY, 'foo', {useSessionStorage: true});
      subject._onLockClosed();
      expect(sessionStorage.getItem(AUTH_REDIRECT_LOCALSTORAGE_KEY)).to.equal(null);
    });

    it('transitions to stored redirect when user and redirect route exists', function() {
      subject.set('session.currentUser', 'foo');
      const redirectRoute = 'fakeRoute';
      subject._onLockClosed(redirectRoute);

      expect(subject.transitionTo).to.have.been.calledWith(redirectRoute);
    });

    it('transitions to home when user does not exist and redirect route exists', function() {
      subject.set('session.currentUser', null);
      const redirectRoute = 'fakeRoute';
      subject._onLockClosed(redirectRoute);

      expect(subject.transitionTo).to.have.been.calledWith('/');
    });

    it('does not transition when redirectRoute is not defined', function() {
      subject._onLockClosed();
      expect(subject.transitionTo).to.not.have.been.called;
    });
  });
});
