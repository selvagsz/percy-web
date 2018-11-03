/* jshint expr:true */
/* eslint-disable no-unused-expressions */
import {setupRenderingTest} from 'ember-mocha';
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
  setupRenderingTest('snapshot-approval-button', {
    integration: true,
  });

  let snapshot;
  let createReview;

  beforeEach(function() {
    setupFactoryGuy(this);
    SnapshotApprovalButton.setContext(this);
    snapshot = make('snapshot', 'withTwoBrowsers');
    createReview = sinon.stub().returns(resolve());
    const activeBrowser = make('browser');
    const hasDiffsInBrowser = true;
    this.setProperties({snapshot, createReview, activeBrowser, hasDiffsInBrowser});
  });

  it('displays correctly when snapshot is not approved and has diffs in active browser', async function() {  //eslint-disable-line
    await this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      activeBrowser=activeBrowser
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);
    await percySnapshot(this.test);
  });

  it('displays correctly when snapshot is not approved does not have diffs in active browser ', async function() {  //eslint-disable-line
    this.set('hasDiffsInBrowser', false);
    await this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      activeBrowser=activeBrowser
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);

    await percySnapshot(this.test);
  });

  it('displays correctly when snapshot is approved', async function() {
    await this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      activeBrowser=activeBrowser
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);
    this.set('snapshot.reviewState', 'approved');
    await percySnapshot(this.test);
  });

  it('calls createReview with correct args when clicked', async function() {
    await this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);
    await SnapshotApprovalButton.clickButton();

    expect(createReview).to.have.been.calledWith([snapshot]);
  });

  it('displays correctly when in loading state ', async function() {
    const deferred = defer();
    const createReview = sinon.stub().returns(deferred.promise);
    this.set('createReview', createReview);
    await this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=(action createReview)
      hasDiffsInBrowser=hasDiffsInBrowser
    }}`);
    await SnapshotApprovalButton.clickButton();

    await percySnapshot(this.test);
  });

  it('is enabled when isDisabled is false', async function() {
    await this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      activeBrowser=activeBrowser
      hasDiffsInBrowser=hasDiffsInBrowser
      isDisabled=false
    }}`);
    expect(SnapshotApprovalButton.isDisabled).to.equal(false);
    await SnapshotApprovalButton.clickButton();
    expect(createReview).to.have.been.calledWith([snapshot]);
  });

  it('is disabled when isDisabled is true', async function() {
    await this.render(hbs`{{snapshot-approval-button
      snapshot=snapshot
      createReview=createReview
      activeBrowser=activeBrowser
      hasDiffsInBrowser=hasDiffsInBrowser
      isDisabled=true
    }}`);
    expect(SnapshotApprovalButton.isDisabled).to.equal(true);
    await SnapshotApprovalButton.clickButton();
    expect(createReview).to.not.have.been.called;
  });
});
