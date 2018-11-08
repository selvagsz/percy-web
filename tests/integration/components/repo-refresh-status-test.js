import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupRenderingTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import {getRootElement} from '@ember/test-helpers';

describe('Integration: RepoRefreshStatus', function() {
  setupRenderingTest('repo-refresh-status', {
    integration: true,
  });

  it('renders correctly when the repo is refreshing', async function() {
    this.set('isRepoRefreshInProgress', true);

    await this.render(hbs`{{repo-refresh-status isRepoRefreshInProgress=isRepoRefreshInProgress}}`);
    expect(getRootElement().innerText).to.include('Checking repo status...');
  });

  it('renders correctly without a date', async function() {
    this.set('isRepoRefreshInProgress', false);

    await this.render(hbs`{{repo-refresh-status isRepoRefreshInProgress=isRepoRefreshInProgress}}`);
    expect(getRootElement().innerText).to.include('Never updated');
  });

  it('renders correctly with a date', async function() {
    const twoMinutesAgo = moment().subtract('2', 'minutes');
    this.set('lastSyncedAt', twoMinutesAgo);
    await this.render(hbs`{{repo-refresh-status lastSyncedAt=lastSyncedAt}}`);
    expect(getRootElement().innerText).to.include('Last updated: 2 minutes ago');
  });
});
