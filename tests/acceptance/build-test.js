import setupAcceptance, {setupSession} from '../helpers/setup-acceptance';
import freezeMoment from '../helpers/freeze-moment';
import moment from 'moment';
import sinon from 'sinon';
import BuildPage from 'percy-web/tests/pages/build-page';
import {TEST_IMAGE_URLS} from 'percy-web/mirage/factories/screenshot';
import {SNAPSHOT_APPROVED_STATE, SNAPSHOT_REVIEW_STATE_REASONS} from 'percy-web/models/snapshot';
import {BUILD_STATES} from 'percy-web/models/build';

describe('Acceptance: Build', function() {
  freezeMoment('2018-05-22');
  setupAcceptance();

  let project;
  let build;
  let defaultSnapshot;
  let noDiffsSnapshot;
  let twoWidthsSnapshot;
  let urlParams;

  setupSession(function(server) {
    const organization = server.create('organization', 'withUser');
    project = server.create('project', {name: 'project-with-finished-build', organization});
    build = server.create('build', {
      project,
      createdAt: moment().subtract(2, 'minutes'),
      finishedAt: moment().subtract(5, 'seconds'),
      totalSnapshotsUnreviewed: 3,
      totalSnapshots: 4,
    });

    defaultSnapshot = server.create('snapshot', 'withComparison', {build});
    noDiffsSnapshot = server.create('snapshot', 'noDiffs', {
      build,
      name: 'No Diffs snapshot',
    });
    twoWidthsSnapshot = server.create('snapshot', 'withComparison', 'withMobile', {
      build,
      name: 'Two widths snapshot',
    });
    // not used yet, but assign to variable when it's important
    server.create('snapshot', 'withMobile', {
      build,
      name: 'Mobile only snapshot',
    });

    urlParams = {
      orgSlug: organization.slug,
      projectSlug: project.slug,
      buildId: build.id,
    };
  });

  it('fetches only snapshots with diffs on initial load', async function() {
    // add some snapshots (to the four above) to cover every review state reason.
    server.create('snapshot', 'withComparison', 'userApproved', {build});
    server.create('snapshot', 'withComparison', 'userApprovedPreviously', {build});

    await BuildPage.visitBuild(urlParams);
    const store = this.application.__container__.lookup('service:store');
    expect(BuildPage.snapshots().count).to.equal(5);
    expect(BuildPage.isUnchangedPanelVisible).to.equal(true);
    expect(store.peekAll('snapshot').get('length')).to.equal(5);

    await BuildPage.snapshotList.clickToggleNoDiffsSection();
    expect(BuildPage.snapshots().count).to.equal(6);
    expect(store.peekAll('snapshot').get('length')).to.equal(6);
  });

  describe('snapshot order/caching', function() {
   it('displays snapshots in the correct order, before and after approval when build is finished', async function() { // eslint-disable-line

      const firstSnapshotExpectedName = defaultSnapshot.name;
      const secondSnapshotExpectedName = twoWidthsSnapshot.name;

      await BuildPage.visitBuild(urlParams);
      expect(BuildPage.snapshots(0).name).to.equal(firstSnapshotExpectedName);
      expect(BuildPage.snapshots(1).name).to.equal(secondSnapshotExpectedName);

      await BuildPage.snapshots(0).clickApprove();
      expect(BuildPage.snapshots(0).name).to.equal(firstSnapshotExpectedName);
      expect(BuildPage.snapshots(1).name).to.equal(secondSnapshotExpectedName);
    });

    // This tests the polling behavior in build-container and that initializeSnapshotOrdering method
    // is called and works correctly in builds/build controller.
    it('sorts snapshots correctly when a build moves from processing to finished via polling', async function() { // eslint-disable-line
      // Get the mirage build object, set it to pending
      const build = server.schema.builds.where({id: '1'}).models[0];
      build.update({state: BUILD_STATES.PROCESSING});

      // Set a defaultSnapshot (which would normally display first)
      // to approved so we have some sort behavior.
      defaultSnapshot.reviewState = SNAPSHOT_APPROVED_STATE;
      defaultSnapshot.reviewStateReason = SNAPSHOT_REVIEW_STATE_REASONS.USER_APPROVED;

      // Overwrite the build endpoint so the first time it will return the processing build
      // and the second time it will return a finished build.
      // This mocks the polling behavior (since the poller runs once in tests) and mocks the effect
      // of a build transitioning from processing to finished.
      const url = `/builds/${build.id}`;
      let hasVisitedBuildPage = false;
      server.get(url, () => {
        if (!hasVisitedBuildPage) {
          hasVisitedBuildPage = true;
          return build;
        } else {
          build.update({state: BUILD_STATES.FINISHED});
          return build;
        }
      });

      await BuildPage.visitBuild(urlParams);

      // We approved the snapshot that would normally be seen as first (default snapshot).
      // So the normal second snapshot (twoWidthsSnapshot) will now be first, and defaultSnapshot
      // will be second.
      expect(BuildPage.snapshotList.lastSnapshot.name).to.equal(defaultSnapshot.name);
      expect(BuildPage.snapshots(0).name).to.equal(twoWidthsSnapshot.name);

      await percySnapshot(this.test);
    });
  });

  // TODO: test number of snapshots, expanded, actionable status for all
  it('shows build overview info dropdown', async function() {
    await BuildPage.visitBuild(urlParams);
    await BuildPage.toggleBuildInfoDropdown();
    await percySnapshot(this.test.fullTitle());
  });

  it('toggles the image and pdiff', async function() {
    await BuildPage.visitBuild(urlParams);
    const snapshot = BuildPage.findSnapshotByName(defaultSnapshot.name);
    expect(currentPath()).to.equal('organization.project.builds.build.index');
    expect(BuildPage.snapshots(0).isDiffImageVisible).to.equal(true);

    await snapshot.clickDiffImage();
    expect(snapshot.isDiffImageVisible).to.equal(false);

    await percySnapshot(this.test.fullTitle() + ' | hides overlay');
    await snapshot.clickDiffImageBox();
    expect(snapshot.isDiffImageVisible).to.equal(true);

    await percySnapshot(this.test.fullTitle() + ' | shows overlay');
  });

  it('walk across snapshots with arrow keys', async function() {
    let firstSnapshot;
    let secondSnapshot;
    let thirdSnapshot;
    const urlBase = `/${project.fullSlug}/builds/1`;

    await BuildPage.visitBuild(urlParams);
    firstSnapshot = BuildPage.snapshots(0);
    secondSnapshot = BuildPage.snapshots(1);
    thirdSnapshot = BuildPage.snapshots(2);
    expect(currentPath()).to.equal('organization.project.builds.build.index');
    expect(currentURL()).to.equal(urlBase);

    await BuildPage.typeDownArrow();
    await percySnapshot(this.test.fullTitle() + ' | Down');
    expect(BuildPage.focusedSnapshot().name).to.equal(defaultSnapshot.name);
    expect(firstSnapshot.isFocused).to.equal(true);
    expect(secondSnapshot.isFocused).to.equal(false);
    expect(thirdSnapshot.isFocused).to.equal(false);

    await BuildPage.typeDownArrow();
    await percySnapshot(this.test.fullTitle() + ' | Down > Down');
    expect(BuildPage.focusedSnapshot().name).to.equal(twoWidthsSnapshot.name);
    expect(firstSnapshot.isFocused).to.equal(false);
    expect(secondSnapshot.isFocused).to.equal(true);
    expect(thirdSnapshot.isFocused).to.equal(false);

    await BuildPage.typeUpArrow();
    await percySnapshot(this.test.fullTitle() + ' | Down > Down > Up');
    expect(BuildPage.focusedSnapshot().name).to.equal(defaultSnapshot.name);
    expect(firstSnapshot.isFocused).to.equal(true);
    expect(secondSnapshot.isFocused).to.equal(false);
    expect(thirdSnapshot.isFocused).to.equal(false);
  });

  it('shows and hides unchanged diffs', async function() {
    const snapshotName = noDiffsSnapshot.name;

    await BuildPage.visitBuild(urlParams);
    expect(BuildPage.isUnchangedPanelVisible).to.equal(true);
    expect(BuildPage.findSnapshotByName(snapshotName)).to.not.exist;

    await percySnapshot(this.test.fullTitle() + ' | shows batched no diffs');
    await BuildPage.clickToggleNoDiffsSection();
    const snapshot = BuildPage.findSnapshotByName(snapshotName);
    expect(BuildPage.isUnchangedPanelVisible).to.equal(false);
    expect(snapshot.isExpanded).to.equal(false);
    expect(snapshot.isNoDiffBoxVisible).to.equal(false);

    const lastSnapshot = BuildPage.snapshotList.lastSnapshot;
    await lastSnapshot.expandSnapshot();
    expect(BuildPage.isUnchangedPanelVisible).to.equal(false);
    expect(lastSnapshot.isExpanded).to.equal(true);
    expect(lastSnapshot.isUnchangedComparisonsVisible).to.equal(true);

    await percySnapshot(this.test.fullTitle() + ' | shows expanded no diffs');
  });

  it('toggles full view', async function() {
    await BuildPage.visitBuild(urlParams);
    await BuildPage.snapshots(0).header.clickToggleFullscreen();
    expect(currentPath()).to.equal('organization.project.builds.build.snapshot');
    expect(BuildPage.snapshotFullscreen.isVisible).to.equal(true);

    await BuildPage.snapshotFullscreen.header.clickToggleFullscreen();
    expect(currentPath()).to.equal('organization.project.builds.build.index');
    expect(BuildPage.snapshotFullscreen.isVisible).to.equal(false);
  });
});

describe('Acceptance: Fullscreen Snapshot', function() {
  freezeMoment('2018-05-22');
  setupAcceptance();

  let project;
  let snapshot;
  let urlParams;

  setupSession(function(server) {
    const organization = server.create('organization', 'withUser');
    project = server.create('project', {name: 'project-with-finished-build', organization});
    const build = server.create('build', {
      project,
      createdAt: moment().subtract(2, 'minutes'),
      finishedAt: moment().subtract(5, 'seconds'),
    });
    snapshot = server.create('snapshot', 'withComparison', {build});

    urlParams = {
      orgSlug: organization.slug,
      projectSlug: project.slug,
      buildId: build.id,
      snapshotId: snapshot.id,
      width: snapshot.comparisons.models[0].width,
      mode: 'diff',
    };
  });

  it('responds to keystrokes and click in full view', async function() {
    await BuildPage.visitFullPageSnapshot(urlParams);
    await BuildPage.snapshotFullscreen.typeRightArrow();
    expect(currentURL()).to.include('mode=head');

    await BuildPage.snapshotFullscreen.typeLeftArrow();
    expect(currentURL()).to.include('mode=diff');

    await BuildPage.snapshotFullscreen.clickComparisonViewer();
    expect(currentURL()).to.include('mode=head');

    await BuildPage.snapshotFullscreen.typeEscape();
    expect(currentPath()).to.equal('organization.project.builds.build.index');
    expect(BuildPage.snapshotFullscreen.isVisible).to.equal(false);
  });

  it('toggles between old/diff/new comparisons when interacting with comparison mode switcher', async function() { // eslint-disable-line
    await BuildPage.visitFullPageSnapshot(urlParams);
    await BuildPage.snapshotFullscreen.clickBaseComparisonMode();
    expect(BuildPage.snapshotFullscreen.comparisonImageUrl).to.equal(TEST_IMAGE_URLS.V1);

    await BuildPage.snapshotFullscreen.clickHeadComparisonMode();
    expect(BuildPage.snapshotFullscreen.comparisonImageUrl).to.equal(TEST_IMAGE_URLS.V2);

    await BuildPage.snapshotFullscreen.clickDiffComparisonMode();
    expect(BuildPage.snapshotFullscreen.diffImageUrl).to.equal(TEST_IMAGE_URLS.DIFF_URL);
  });

  it('displays the dropdown', async function() {
    await BuildPage.visitFullPageSnapshot(urlParams);
    BuildPage.snapshotFullscreen.header.clickDropdownToggle();

    await percySnapshot(this.test);
  });
});

describe('Acceptance: Pending Build', function() {
  freezeMoment('2018-05-22');
  setupAcceptance();
  let urlParams;

  setupSession(function(server) {
    let organization = server.create('organization', 'withUser');
    let project = server.create('project', {name: 'pending build', organization});
    let build = server.create('build', {
      project,
      createdAt: moment().subtract(2, 'minutes'),
      state: 'pending',
    });

    urlParams = {
      orgSlug: organization.slug,
      projectSlug: project.slug,
      buildId: build.id,
    };
  });

  it('shows as pending', async function() {
    await BuildPage.visitBuild(urlParams);
    expect(currentPath()).to.equal('organization.project.builds.build.index');

    await percySnapshot(this.test.fullTitle() + ' on the build page');
    await BuildPage.toggleBuildInfoDropdown();
    await percySnapshot(this.test.fullTitle() + ' on the build page with build info open');
  });
});

describe('Acceptance: Processing Build', function() {
  freezeMoment('2018-05-22');
  setupAcceptance();
  let urlParams;

  setupSession(function(server) {
    let organization = server.create('organization', 'withUser');
    let project = server.create('project', {name: 'project-with-processing-build', organization});
    let build = server.create('build', 'processing', {
      project,
      createdAt: moment().subtract(2, 'minutes'),
    });

    urlParams = {
      orgSlug: organization.slug,
      projectSlug: project.slug,
      buildId: build.id,
    };
  });

  it('shows as processing', async function() {
    await BuildPage.visitBuild(urlParams);
    expect(currentPath()).to.equal('organization.project.builds.build.index');

    await percySnapshot(this.test.fullTitle() + ' on the build page');
    await BuildPage.toggleBuildInfoDropdown();
    await percySnapshot(this.test.fullTitle() + ' on the build page with build info open');
  });
});

describe('Acceptance: Failed Build', function() {
  freezeMoment('2018-05-22');
  setupAcceptance();
  let urlParams;

  setupSession(function(server) {
    let organization = server.create('organization', 'withUser');
    let project = server.create('project', {name: 'project-with-failed-build', organization});
    let build = server.create('build', {
      project,
      createdAt: moment().subtract(2, 'minutes'),
      state: 'failed',
      failureReason: 'render_timeout',
      failureDetails: {failed_snapshots: ['Home page that pops open a dialog']},
    });

    urlParams = {
      orgSlug: organization.slug,
      projectSlug: project.slug,
      buildId: build.id,
    };
  });

  it('shows as failed', async function() {
    await BuildPage.visitBuild(urlParams);
    window.Intercom = sinon.stub();
    expect(currentPath()).to.equal('organization.project.builds.build.index');

    await percySnapshot(this.test.fullTitle() + ' on the build page');
    await BuildPage.toggleBuildInfoDropdown();
    await percySnapshot(this.test.fullTitle() + ' on the build page with build info open');
    await BuildPage.clickShowSupportLink();
    expect(window.Intercom).to.have.been.calledWith('show');
  });
});
