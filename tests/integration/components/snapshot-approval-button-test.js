/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupComponentTest} from 'ember-mocha';
import {expect} from 'chai';
import {it, describe, beforeEach} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import {resolve, defer} from 'rsvp';
import SnapshotApprovalButton from 'percy-web/tests/pages/components/snapshot-approval-button';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';

describe('Integration: SnapshotApprovalButton', function() {
  setupComponentTest('snapshot-approval-button', {
    integration: true,
  });

  let snapshot;
  let createReview;

  beforeEach(function() {
    setupFactoryGuy(this.container);
    SnapshotApprovalButton.setContext(this);
    snapshot = make('snapshot', 'withTwoBrowsers');
    createReview = sinon.stub().returns(resolve());
    const activeBrowser = make('browser');
    const hasDiffsInBrowser = true;
    this.setProperties({snapshot, createReview, activeBrowser, hasDiffsInBrowser});
  });

  it('displays correctly when snapshot is not approved and has diffs in active browser', function() {  // eslint-disable-line
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      activeBrowser=activeBrowser
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);
    percySnapshot(this.test);
  });

  it('displays correctly when snapshot is not approved does not have diffs in active browser ', function() {  // eslint-disable-line
    this.set('hasDiffsInBrowser', false);
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      activeBrowser=activeBrowser
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);

    percySnapshot(this.test);
  });

  it('displays correctly when snapshot is approved', function() {
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      activeBrowser=activeBrowser
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);
    this.set('snapshot.reviewState', 'approved');
    percySnapshot(this.test);
  });

  it('calls createReview with correct args when clicked', function() {
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);
    SnapshotApprovalButton.clickButton();

    expect(createReview).to.have.been.calledWith([snapshot]);
  });

  it('displays correctly when in loading state ', function() {
    const deferred = defer();
    const createReview = sinon.stub().returns(deferred.promise);
    this.set('createReview', createReview);
    this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=(action createReview)
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);
    SnapshotApprovalButton.clickButton();

    percySnapshot(this.test);
  });
});
