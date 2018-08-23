import {visitable, create, clickable, isVisible} from 'ember-cli-page-object';
import {SnapshotViewerFull} from 'percy-web/tests/pages/components/snapshot-viewer-full';
import {SnapshotList} from 'percy-web/tests/pages/components/snapshot-list';
import {alias} from 'ember-cli-page-object/macros';
import {BuildApprovalButton} from 'percy-web/tests/pages/components/build-approval-button';
import {BuildInfoDropdown} from 'percy-web/tests/pages/components/build-info-dropdown';
import {BrowserSwitcher} from 'percy-web/tests/pages/components/browser-switcher';

const SELECTORS = {
  SHOW_SUPPORT_LINK: '[data-test-build-overview-show-support]',
  TOGGLE_DIFFS_BUTTON: '[data-test-toggle-diffs-button]',
  PROJECT_LINK: '[data-test-build-toolbar-project-link]',
  PUBLIC_BUILD_NOTICE: '[data-test-public-project-notice]',
};

const BuildPage = {
  visitBuild: visitable('/:orgSlug/:projectSlug/builds/:buildId'),
  visitFullPageSnapshot: visitable(
    '/:orgSlug/:projectSlug/builds/:buildId/view/:snapshotId/:width',
  ),

  browserSwitcher: BrowserSwitcher,
  buildApprovalButton: BuildApprovalButton,
  buildInfoDropdown: BuildInfoDropdown,

  toggleBuildInfoDropdown: alias('buildInfoDropdown.toggleBuildInfoDropdown'),

  isUnchangedPanelVisible: alias('snapshotList.isNoDiffsBatchVisible'),
  clickToggleNoDiffsSection: alias('snapshotList.clickToggleNoDiffsSection'),

  snapshotList: SnapshotList,
  snapshots: alias('snapshotList.snapshots'),

  snapshotTitles: {
    isDescriptor: true,
    get() {
      return this.snapshots().map(snapshot => snapshot.name);
    },
  },

  findSnapshotByName(name) {
    return this.snapshots()
      .toArray()
      .findBy('name', name);
  },

  focusedSnapshot() {
    return this.snapshots()
      .toArray()
      .findBy('isFocused', true);
  },

  urlWithSnapshotQueryParam(snapshot, build) {
    return `/${build.project.fullSlug}/builds/${build.id}?snapshot=${snapshot.id}`;
  },

  clickProject: clickable(SELECTORS.PROJECT_LINK),

  typeDownArrow: alias('snapshotList.typeDownArrow'),
  typeUpArrow: alias('snapshotList.typeUpArrow'),
  typeDiffToggleKey: alias('snapshotList.typeDiffToggleKey'),

  snapshotFullscreen: SnapshotViewerFull,
  isFullscreenModalVisible: isVisible(SELECTORS.SNAPSHOT_FULL_MODAL),

  clickShowSupportLink: clickable(SELECTORS.SHOW_SUPPORT_LINK),

  clickToggleDiffsButton: clickable(SELECTORS.TOGGLE_DIFFS_BUTTON),
  isDiffsVisibleForAllSnapshots: alias('snapshotList.isDiffsVisibleForAllSnapshots'),

  isPublicBuildNoticeVisible: isVisible(SELECTORS.PUBLIC_BUILD_NOTICE),
};

export default create(BuildPage);
