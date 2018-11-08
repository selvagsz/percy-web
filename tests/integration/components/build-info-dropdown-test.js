/* jshint expr:true */
import {setupRenderingTest} from 'ember-mocha';
import {beforeEach, it, describe} from 'mocha';
import {percySnapshot} from 'ember-percy';
import hbs from 'htmlbars-inline-precompile';
import {make} from 'ember-data-factory-guy';
import setupFactoryGuy from 'percy-web/tests/helpers/setup-factory-guy';
import BuildInfoDropdown from 'percy-web/tests/pages/components/build-info-dropdown';
import AdminMode from 'percy-web/lib/admin-mode';

describe('Integration: BuildInfoDropdownComponent', function() {
  setupRenderingTest('build-info-dropdown', {
    integration: true,
  });

  beforeEach(function() {
    setupFactoryGuy(this);
    BuildInfoDropdown.setContext(this);
    AdminMode.clear();
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

      await this.render(hbs`{{build-info-dropdown
        build=build
        isShowingModal=true
        renderInPlace=true
      }}`);
      await BuildInfoDropdown.toggleBuildInfoDropdown();

      await percySnapshot(this.test);
    });
  });

  it('hides admin info if user is not admin', async function() {
    const build = make('build', 'finished');
    this.set('build', build);

    await this.render(hbs`{{build-info-dropdown
      build=build
      isShowingModal=true
      renderInPlace=true
    }}`);
    await BuildInfoDropdown.toggleBuildInfoDropdown();

    expect(BuildInfoDropdown.isAdminDetailsPresent).to.equal(false);

    await percySnapshot(this.test);
  });

  it('shows admin info if user is an admin', async function() {
    const build = make('build', 'finished');
    this.set('build', build);

    AdminMode.setAdminMode();

    await this.render(hbs`{{build-info-dropdown
       build=build
       isShowingModal=true
       renderInPlace=true
     }}`);
    await BuildInfoDropdown.toggleBuildInfoDropdown();
    expect(BuildInfoDropdown.isAdminDetailsPresent).to.equal(true);

    await percySnapshot(this.test);
  });

  describe('with a gitlab self-hosted repo', function() {
    beforeEach(async function() {
      const build = make('build', 'withGitlabSelfHostedRepo', 'hasMergeRequest', {buildNumber: 1});
      this.setProperties({build});

      await this.render(hbs`{{build-info-dropdown
        build=build
        isShowingModal=true
        renderInPlace=true
      }}`);
      await BuildInfoDropdown.toggleBuildInfoDropdown();
    });

    it('has the correct pull request label', async function() {
      expect(BuildInfoDropdown.pullRequestLabelText, 'pull request label is incorrect').to.equal(
        'Merge Request',
      );
      await percySnapshot(this.test.fullTitle(), {widths: [450]});
    });
  });

  describe('with a github repo', function() {
    beforeEach(async function() {
      const build = make('build', 'withGithubRepo', 'hasPullRequest', {buildNumber: 1});
      this.setProperties({build});

      await this.render(hbs`{{build-info-dropdown
        build=build
        isShowingModal=true
        renderInPlace=true
      }}`);
      await BuildInfoDropdown.toggleBuildInfoDropdown();
    });

    it('has the correct pull request label', async function() {
      expect(BuildInfoDropdown.pullRequestLabelText, 'pull request label is incorrect').to.equal(
        'Pull Request',
      );
      await percySnapshot(this.test.fullTitle(), {widths: [450]});
    });
  });
});
