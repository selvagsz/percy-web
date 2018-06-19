import {text, collection, create} from 'ember-cli-page-object';

const SELECTORS = {
  SETTINGS_CONTAINER: '[data-test-organizations-settings-nav-wrapper]',
  PROJECT_SIDENAV_LIST: '[data-test-sidenav-list-projects]',
  PROJECT_SIDENAV_ITEM: '[data-test-sidenav-list-item]',
};

export const SettingsNavWrapper = {
  scope: SELECTORS.SETTINGS_CONTAINER,

  projectLinks: collection({
    itemScope: SELECTORS.PROJECT_SIDENAV_ITEM,
    item: {
      projectName: text(),
    },
  }),
};

export default create(SettingsNavWrapper);
