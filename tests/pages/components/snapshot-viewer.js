import {create, isVisible, clickable, hasClass, notHasClass} from 'ember-cli-page-object';
import {SnapshotViewerHeader} from 'percy-web/tests/pages/components/snapshot-viewer-header';
import {alias} from 'ember-cli-page-object/macros';

const SELECTORS = {
  SNAPSHOT_VIEWER: '[data-test-snapshot-viewer]',
  DIFF_IMAGE: '[data-test-comparison-viewer-full-diff-image-overlay] img',
  DIFF_IMAGE_BOX: '[data-test-comparison-viewer-diff-image-container] img',
  NO_DIFF_BOX: '[data-test-comparison-viewer-unchanged]',
  SHOW_UNCHANGED_COMPARISONS: '[data-test-comaprison-viewer-show-unchanged-comparisons]',
};

export const SnapshotViewer = {
  scope: SELECTORS.SNAPSHOT_VIEWER,

  header: SnapshotViewerHeader,
  widthSwitcher: alias('header.widthSwitcher'),
  name: alias('header.titleText'),
  expandSnapshot: alias('header.expandSnapshot'),

  isApproved: alias('header.isApproved'),
  isUnapproved: alias('header.isUnapproved'),
  isUnchanged: alias('header.isUnchanged'),

  isCollapsed: hasClass('SnapshotViewer--collapsed'),
  isExpanded: notHasClass('SnapshotViewer--collapsed'),

  isDiffImageVisible: isVisible(SELECTORS.DIFF_IMAGE),
  clickDiffImage: clickable(SELECTORS.DIFF_IMAGE),

  isDiffImageBoxVisible: isVisible(SELECTORS.DIFF_IMAGE_BOX),
  clickDiffImageBox: clickable(SELECTORS.DIFF_IMAGE_BOX),

  isNoDiffBoxVisible: isVisible(SELECTORS.NO_DIFF_BOX),

  isFocused: hasClass('SnapshotViewer--focus'),

  isActionable: hasClass('SnapshotViewer--actionable'),

  isUnchangedComparisonsVisible: isVisible(SELECTORS.SHOW_UNCHANGED_COMPARISONS),

  clickApprove: alias('header.clickApprove'),
};

export default create(SnapshotViewer);
