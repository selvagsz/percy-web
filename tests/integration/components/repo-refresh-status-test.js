import {expect} from 'chai';
import {describe, it} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

// FIXME: (faun) update these to use native dom selectors once
// the latest testing APIs are available in this app.
// https://guides.emberjs.com/release/testing/testing-component
// https://github.com/emberjs/ember-mocha#setup-tests

describe('Integration: RepoRefreshStatus', function() {
  setupComponentTest('repo-refresh-status', {
    integration: true,
  });

  it('renders correctly when the repo is refreshing', function() {
    this.set('isRepoRefreshInProgress', true);

    this.render(hbs`{{repo-refresh-status isRepoRefreshInProgress=isRepoRefreshInProgress}}`);
    expect(this.$().text()).to.include('Checking repo status...');
  });

  it('renders correctly without a date', function() {
    this.set('isRepoRefreshInProgress', false);

    this.render(hbs`{{repo-refresh-status isRepoRefreshInProgress=isRepoRefreshInProgress}}`);
    expect(this.$().text()).to.include('Never updated');
  });

  it('renders correctly with a date', function() {
    const twoMinutesAgo = moment().subtract('2', 'minutes');
    this.set('lastSyncedAt', twoMinutesAgo);
    this.render(hbs`{{repo-refresh-status lastSyncedAt=lastSyncedAt}}`);
    expect(this.$().text()).to.include('Last updated: 2 minutes ago');
  });
});
