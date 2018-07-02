/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import {it, describe, beforeEach, afterEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import {make} from 'ember-data-factory-guy';
import {resolve, reject} from 'rsvp';
import sinon from 'sinon';
import utils from 'percy-web/lib/utils';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('SessionService', function() {
  setupTest('service:session', {
    needs: ['service:analytics', 'model:user', 'service:raven', 'model:identity'],
  });

  describe('loadCurrentUser', function() {
    let subject = null;
    let store = null;
    let user;

    beforeEach(function() {
      subject = this.subject();
      store = subject.get('store');

      setupFactoryGuy(this.container);
      user = make('user', {id: 'foo'});
    });

    describe('when isAuthenticated is false', function() {
      it('returns a resolved promise ', function() {
        subject.set('isAuthenticated', false);
        const promise = subject.loadCurrentUser();

        expect(promise).to.be.fulfilled;
      });
    });

    describe('when isAuthenticated is true and the user query passes', function() {
      beforeEach(function() {
        subject.set('isAuthenticated', true);
        store.queryRecord = sinon.stub().returns(resolve(user));
      });

      it('sets current user', function() {
        const promise = subject.loadCurrentUser();

        return promise.then(() => {
          expect(subject.get('currentUser.id')).to.equal(user.get('id'));
        });
      });

      it('sets raven user context', function() {
        const promise = subject.loadCurrentUser();
        const raven = subject.get('raven');
        const callRavenStub = sinon.stub(raven, 'callRaven');
        raven.set('isRavenUsable', true);

        return promise.then(() => {
          expect(callRavenStub).to.have.been.calledWith('setUserContext', {id: user.get('id')});
        });
      });

      it('sends intercom data', function() {
        window.Intercom = sinon.stub();
        const promise = subject.loadCurrentUser();

        return promise.then(() => {
          expect(window.Intercom).to.have.been.calledWith('update', {
            user_id: user.get('id'),
            user_hash: user.get('userHash'),
            name: user.get('name'),
            email: user.get('email'),
            created_at: user.get('createdAt').getTime() / 1000,
          });
        });
      });

      it('sends sets up analytics data', function() {
        const setupAnalyticsStub = sinon.stub();
        subject.set('analytics.identifyUser', setupAnalyticsStub);
        const promise = subject.loadCurrentUser();

        return promise.then(() => {
          expect(setupAnalyticsStub).to.have.been.calledWith(user);
        });
      });
    });

    describe('when isAuthenticated is true and the user query fails', function() {
      let windowStub;
      beforeEach(function() {
        subject.set('isAuthenticated', true);
        store.queryRecord = sinon.stub().returns(reject());
        windowStub = sinon.stub(utils, 'setWindowLocation');
      });

      afterEach(function() {
        windowStub.restore();
      });

      it('invalidates the session', function() {
        const invalidateStub = sinon.stub().returns(resolve());
        subject.invalidate = invalidateStub;
        const promise = subject.loadCurrentUser();

        return promise.then(() => {
          expect(invalidateStub).to.have.been.called;
          expect(windowStub).to.have.been.calledWith('/api/auth/logout');
        });
      });

      it('clears raven user context', function() {
        subject.invalidate = sinon.stub().returns(resolve());
        const promise = subject.loadCurrentUser();
        const raven = subject.get('raven');
        const callRavenStub = sinon.stub(raven, 'callRaven');
        raven.set('isRavenUsable', true);

        return promise.then(() => {
          expect(callRavenStub).to.have.been.calledWith();
        });
      });

      it('clears analytics user context', function() {
        subject.invalidate = sinon.stub().returns(resolve());
        const analyticsInvalidateStub = sinon.stub();
        subject.set('analytics.invalidate', analyticsInvalidateStub);

        const promise = subject.loadCurrentUser();

        return promise.then(() => {
          expect(analyticsInvalidateStub).to.have.been.called;
        });
      });
    });

    // TODO: unsure how to test a function failing but not break tests.
    describe.skip('when isAuthenticated is true and the third party setup fails', function() {
      beforeEach(function() {
        subject.set('isAuthenticated', true);
        store.queryRecord = sinon.stub().returns(resolve(user));
      });

      it('does not invalidate the session', function() {
        subject.set('_setupSentry', function() {
          throw new Error('foo');
        });
        const invalidateStub = sinon.stub();
        subject.set('invalidate', invalidateStub);

        const promise = subject.loadCurrentUser();

        return promise.then(() => {
          expect(invalidateStub).to.not.have.been.called;
        });
      });
    });
  });
});
