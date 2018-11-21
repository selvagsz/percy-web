import {text, clickable, collection, create} from 'ember-cli-page-object';

const SELECTORS = {
  SETTINGS_CONTAINER: '[data-test-organizations-settings-nav-wrapper]',
  PROJECT_SIDENAV_LIST: '[data-test-sidenav-list-projects]',
  PROJECT_SIDENAV_ITEM: '[data-test-sidenav-list-item]',
  BILLING_LINK: '.data-test-sidenav-billing',
  TOGGLE_ARCHIVED_PROJECTS: '[data-test-toggle-archived-projects]',
};

export const SettingsNavWrapper = {
  scope: SELECTORS.SETTINGS_CONTAINER,

  projectLinks: collection({
    itemScope: SELECTORS.PROJECT_SIDENAV_ITEM,
    item: {
      projectName: text(),
    },
  }),

  clickBilling: clickable(SELECTORS.BILLING_LINK),

  toggleArchivedProjects: clickable(SELECTORS.TOGGLE_ARCHIVED_PROJECTS),
};

export default create(SettingsNavWrapper);
