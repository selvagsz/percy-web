import {create, clickable, isVisible} from 'ember-cli-page-object';
import {alias} from 'ember-cli-page-object/macros';

const SELECTORS = {
  BUILD_TOOLBAR: '[data-test-build-toolbar]',
  TOGGLE_DIFFS_BUTTON: '[data-test-toggle-diffs-button]',
  PROJECT_LINK: '[data-test-build-toolbar-project-link]',
  PUBLIC_PROJECT_ICON: '[data-test-build-public-project]',
};

export const BuildToolbar = {
  scope: SELECTORS.BUILD_TOOLBAR,

  clickProject: clickable(SELECTORS.PROJECT_LINK),

  clickToggleDiffsButton: clickable(SELECTORS.TOGGLE_DIFFS_BUTTON),
  isDiffsVisibleForAllSnapshots: alias('snapshotList.isDiffsVisibleForAllSnapshots'),

  isPublicProjectIconVisible: isVisible(SELECTORS.PUBLIC_PROJECT_ICON),
};

export default create(BuildToolbar);
