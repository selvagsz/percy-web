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

    it(`renders in state: ${testTitle}`, async function() {
      let build = make.apply(this, ['build'].concat(state));
      this.set('build', build);

      this.render(hbs`{{build-info-dropdown build=build isShowingModal=true renderInPlace=true}}`);
      await BuildInfoDropdown.toggleBuildInfoDropdown();

      percySnapshot(this.test);
    });
  });

  it('hides admin info if user is not admin', async function() {
    const build = make('build', 'finished');
    this.set('build', build);

    this.render(hbs`{{build-info-dropdown
      build=build
      isShowingModal=true
      renderInPlace=true
    }}`);
    await BuildInfoDropdown.toggleBuildInfoDropdown();

    expect(BuildInfoDropdown.isAdminDetailsPresent).to.equal(false);

    percySnapshot(this.test);
  });

  it('shows admin info if user is an admin', async function() {
    const build = make('build', 'finished');
    this.set('build', build);

    AdminMode.setAdminMode();

    this.render(hbs`{{build-info-dropdown
       build=build
       isShowingModal=true
       renderInPlace=true
     }}`);
    await BuildInfoDropdown.toggleBuildInfoDropdown();
    expect(BuildInfoDropdown.isAdminDetailsPresent).to.equal(true);

    percySnapshot(this.test);
  });

  describe('with a gitlab self-hosted repo', function() {
    beforeEach(function() {
      const build = make('build', 'withGitlabSelfHostedRepo', 'hasMergeRequest', {buildNumber: 1});
      this.setProperties({build});

      this.render(hbs`{{build-info-dropdown
        build=build
        isShowingModal=true
        renderInPlace=true
      }}`);
      BuildInfoDropdown.toggleBuildInfoDropdown();
    });

    it('has the correct pull request label', function() {
      expect(BuildInfoDropdown.pullRequestLabelText, 'pull request label is incorrect').to.equal(
        'Merge Request',
      );
      percySnapshot(this.test.fullTitle(), {widths: [450]});
    });
  });

  describe('with a github repo', function() {
    beforeEach(function() {
      const build = make('build', 'withGithubRepo', 'hasPullRequest', {buildNumber: 1});
      this.setProperties({build});

      this.render(hbs`{{build-info-dropdown
        build=build
        isShowingModal=true
        renderInPlace=true
      }}`);
      BuildInfoDropdown.toggleBuildInfoDropdown();
    });

    it('has the correct pull request label', function() {
      expect(BuildInfoDropdown.pullRequestLabelText, 'pull request label is incorrect').to.equal(
        'Pull Request',
      );
      percySnapshot(this.test.fullTitle(), {widths: [450]});
    });
  });
});
