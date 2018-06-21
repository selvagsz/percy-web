/* jshint expr:true */
import {setupComponentTest} from 'ember-mocha';
import {beforeEach, afterEach, it, describe} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import BuildInfoDropdown from 'percy-web/tests/pages/components/build-info-dropdown';
import AdminMode from 'percy-web/lib/admin-mode';

describe('Integration: BuildInfoDropdownComponent', function() {
  let isAdminModeEnabled;
  setupComponentTest('build-info-dropdown', {
    integration: true,
  });

  beforeEach(function() {
    isAdminModeEnabled = this.get('isAdminEnabled');
    setupFactoryGuy(this.container);
    BuildInfoDropdown.setContext(this);
    AdminMode.clear();
  });

  afterEach(function() {
    this.set('isAdminEnabled', isAdminModeEnabled);
  });

  let states = [
    ['pending'],
    ['processing'],
    ['finished', 'withBaseBuild'],
    ['finished', 'noDiffs', 'withBaseBuild'],
    ['failed', 'missingResources', 'withBaseBuild'],
    ['failed', 'noSnapshots', 'withBaseBuild'],
    ['failed', 'renderTimeout', 'withBaseBuild'],
    ['expired', 'withBaseBuild'],
    ['finished', 'withRepo', 'withBaseBuild', 'withLongBranch'],
    ['finished', 'withRepo', 'withBaseBuild', 'withLongHeadCommitMessage'],
    ['finished', 'withRepo', 'withBaseBuild', 'withNoSpacesMessageCommitMessage'],
    ['finished', 'withRepo', 'hasPullRequest'],
    ['finished', 'withRepo', 'hasPullRequestWithoutTitle'],
  ];

  states.forEach(state => {
    let testTitle = state.join(' ');

    it(`renders in state: ${testTitle}`, function() {
      let build = make.apply(this, ['build'].concat(state));
      this.set('build', build);

      this.render(hbs`{{build-info-dropdown build=build isShowingModal=true renderInPlace=true}}`);

      percySnapshot(this.test);
    });
  });

  it('hides admin info if user is not admin', function() {
    const build = make('build', 'finished');
    this.set('build', build);

    this.render(hbs`{{build-info-dropdown
      build=build
      isShowingModal=true
      renderInPlace=true
    }}`);

    expect(BuildInfoDropdown.isAdminDetailsPresent).to.equal(false);

    percySnapshot(this.test);
  });

  it('shows admin info if user is an admin', function() {
    const build = make('build', 'finished');
    this.set('build', build);

    AdminMode.setAdminMode();

    this.render(hbs`{{build-info-dropdown
       build=build
       isShowingModal=true
       renderInPlace=true
     }}`);

    expect(BuildInfoDropdown.isAdminDetailsPresent).to.equal(true);

    percySnapshot(this.test);
  });
});
