import {visitable, create, clickable} from 'ember-cli-page-object';
import {SettingsNavWrapper} from 'percy-web/tests/pages/components/organizations/settings-nav-wrapper'; // eslint-disable-line
import {ProjectEdit} from 'percy-web/tests/pages/components/forms/project-edit';
import {alias} from 'ember-cli-page-object/macros';
import {BrowserFamilySelector} from 'percy-web/tests/pages/components/projects/browser-family-selector'; // eslint-disable-line
import {WebhookConfigList} from 'percy-web/tests/pages/components/projects/webhook-config-list'; // eslint-disable-line

const SELECTORS = {
  SUPPORT_LINK: '[data-test-project-settings-show-support]',
};

export const ProjectSettingsPage = {
  visitProjectSettings: visitable('/:orgSlug/:projectSlug/settings'),

  sideNav: SettingsNavWrapper,
  projectLinks: alias('sideNav.projectLinks'),

  projectEditForm: ProjectEdit,

  isAutoApproveBranchesVisible: alias('projectEditForm.isAutoApproveBranchesVisible'),

  browserSelector: BrowserFamilySelector,

  clickShowSupport: clickable(SELECTORS.SUPPORT_LINK),

  webhookConfigList: WebhookConfigList,
};

export default create(ProjectSettingsPage);
