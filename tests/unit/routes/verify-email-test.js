/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import {it, describe, beforeEach, afterEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import sinon from 'sinon';
import $ from 'jquery';
import {resolve, reject} from 'rsvp';
import utils from 'percy-web/lib/utils';

describe('VerifyEmailRoute', function() {
  let subject;
  let ajaxStub;
  const fakeCode = 'codezzz';

  setupTest('route:verify-email', {
    needs: ['service:session', 'service:headTags'],
  });

  beforeEach(function() {
    subject = this.subject();
    sinon.stub(subject, 'transitionTo');
    ajaxStub = sinon.stub($, 'ajax');
  });

  afterEach(function() {
    $.ajax.restore();
  });

  describe('model', function() {
    it('calls ajax with corrrect route and code', function() {
      ajaxStub.returns(resolve());
      const expectedArgs = {
        type: 'PATCH',
        url: utils.buildApiUrl('emailVerifications', fakeCode),
      };

      const modelPromise = subject.model({code: fakeCode});
      return modelPromise.then(() => {
        expect(ajaxStub).to.have.been.calledWith(expectedArgs);
      });
    });
  });

  describe('when the request fails', function() {
    it('parses error and returns it when error message is formatted correctly', function() {
      const errorMessage = 'it did not work';
      ajaxStub.returns(reject({responseJSON: {errors: [{detail: errorMessage}]}}));

      const modelPromise = subject.model({code: 'whatever'});

      return modelPromise.then(model => {
        expect(model).to.equal(errorMessage);
      });
    });

    it('does not explode when error message is formatted poorly', function() {
      ajaxStub.returns(reject('poorly formatted error response'));

      const modelPromise = subject.model({code: 'whatever'});

      return modelPromise.then(() => {
        expect(subject).to.be.ok;
      });
    });
  });

  describe('when the request succeeds', function() {
    it('returns succes:true', function() {
      ajaxStub.returns(resolve());
      const modelPromise = subject.model({code: fakeCode});

      return modelPromise.then(model => {
        expect(model).to.eql({success: true});
      });
    });
  });
});
