import {it, describe, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import {make} from 'ember-data-factory-guy';
import sinon from 'sinon';
import browserSwitcher from 'percy-web/tests/pages/components/browser-switcher';

describe('Integration: BrowserSwitcher', function() {
  setupComponentTest('browser-switcher', {
    integration: true,
  });

  let browsers;
  let updateActiveBrowserStub;

  const unapprovedSnapshotsWithDiffForBrowsers = {
    'firefox-id': ['diff1', 'diff2'],
    'chrome-id': ['difffoo'],
  };

  beforeEach(function() {
    setupFactoryGuy(this.container);
    browserSwitcher.setContext(this);

    const build = make('build');
    build.set('unapprovedSnapshotsWithDiffForBrowsers', unapprovedSnapshotsWithDiffForBrowsers);

    browsers = [make('browser'), make('browser', 'chrome')];
    const activeBrowser = browsers[1];
    updateActiveBrowserStub = sinon.stub();

    this.setProperties({
      build,
      browsers,
      activeBrowser,
      updateActiveBrowser: updateActiveBrowserStub,
    });

    this.render(hbs`{{browser-switcher
      browsers=browsers
      activeBrowser=activeBrowser
      updateActiveBrowser=updateActiveBrowser
      build=build
    }}`);
  });

  it('renders correct number of browsers', function() {
    expect(browserSwitcher.buttons().count).to.equal(2);
  });

  it('displays the correct browser as active', function() {
    expect(browserSwitcher.buttons(1).isActive).to.equal(true);
  });

  it('calls updateActiveBrowser when button is clicked', function() {
    browserSwitcher.buttons(0).click();
    expect(updateActiveBrowserStub).to.have.been.calledWith(browsers[0]);
  });

  it('does not display diff counts if there is not a build provided', function() {
    this.set('build', null);
    expect(browserSwitcher.buttons(0).isDiffCountPresent).to.equal(false);
    expect(browserSwitcher.buttons(1).isDiffCountPresent).to.equal(false);
  });

  it('it displays diff counts if there is a build provided', function() {
    expect(browserSwitcher.buttons(0).diffCount).to.equal('2');
    expect(browserSwitcher.buttons(1).diffCount).to.equal('1');
  });
});
